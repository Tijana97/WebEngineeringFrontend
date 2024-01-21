import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import styles from './HomeScreenStyles.module.css';
import { Button, Modal, Typography } from '@mui/material';
import filterLogo from '../../images/filter.svg';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import {
  FromAndToDate,
  RoomDto,
  SearchWithFilters
} from '../../services/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledDatePicker } from '../../components/Datepicker/Datepicker';
import { ControlledSelect } from '../../components/Select/Select';
import { ControlledInput } from '../../components/Input/Input';
import { ImageCard } from '../../components/ImageCard/ImageCard';
import { setLoading } from '../../store/authSlice';
import axios from 'axios';
import { config } from '../../config/config';
import { differenceInDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { RootState } from '../../store/rootReducer';
import { TOKEN } from '../../services/token';

const validationSchema = yup.object().shape({
  input: yup.string().optional(),
  dateFrom: yup
    .date()
    .required('This field is required')
    .test({
      name: 'dateFromSmallerThanDateTo',
      message: 'Invalid format!',
      test: function (dateFrom) {
        const { dateTo } = this.parent;
        return dateFrom < dateTo;
      }
    }),
  dateTo: yup.date().required('This field is required'),
  capacity: yup.number().required('This field is required')
});

export const HomeScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<SearchWithFilters>({
    resolver: yupResolver(validationSchema)
  });

  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isLocationChecked, setIsLocationChecked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<FromAndToDate>();
  const [totalNights, setTotalNights] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<
    RoomDto & { totalNights: number }
  >();
  const [hotelData, setHotelData] = useState<RoomDto[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const checkLocation = () => {
    if (location.pathname.includes('login')) {
      navigate('/home');
    } else {
      setIsLocationChecked(true);
    }
  };

  const fetchHotels = () => {
    dispatch(setLoading(true));

    const dateNow = new Date();
    const tomorrow = new Date(dateNow);
    tomorrow.setDate(dateNow.getDate() + 1);

    setSelectedDates({
      fromDate: dateNow.toISOString(),
      toDate: tomorrow.toISOString()
    });

    axios
      .get(
        `${
          config.API_URL
        }api/rooms/available/${dateNow.toISOString()}/${tomorrow.toISOString()}`
      )
      .then(function (response) {
        if (response.data) {
          setHotelData(response.data);
          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(false));
          console.log('NOT GOOD');
        }
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        console.log('Error: ', error);
      });
  };

  const fetchHotelsWithoutInput = (search: SearchWithFilters) => {
    dispatch(setLoading(true));
    setSelectedDates({
      fromDate: search.dateFrom.toISOString(),
      toDate: search.dateTo.toISOString()
    });
    axios
      .get(
        `${
          config.API_URL
        }api/rooms/availableCapacity/${search.dateFrom.toISOString()}/${search.dateTo.toISOString()}/${
          search.capacity
        }`
      )
      .then(function (response) {
        if (response.data) {
          setHotelData(response.data);
          setTotalNights(getTotalNights(search.dateFrom, search.dateTo));
          dispatch(setLoading(false));
        } else {
          console.log('NOT GOOD');
          dispatch(setLoading(false));
        }
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        console.log('Error: ', error);
      });
  };

  const fetchHotelsWithInput = (search: SearchWithFilters) => {
    dispatch(setLoading(true));
    setSelectedDates({
      fromDate: search.dateFrom.toISOString(),
      toDate: search.dateTo.toISOString()
    });
    axios
      .get(
        `${config.API_URL}api/rooms/search/${
          search.input
        }/${search.dateFrom.toISOString()}/${search.dateTo.toISOString()}/${
          search.capacity
        }`
      )
      .then(function (response) {
        if (response.data) {
          setHotelData(response.data);
          setTotalNights(getTotalNights(search.dateFrom, search.dateTo));
          dispatch(setLoading(false));
        } else {
          console.log('NOT GOOD');
          dispatch(setLoading(false));
        }
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        console.log('Error: ', error);
      });
  };

  useEffect(() => {
    checkLocation();
  }, []);

  useEffect(() => {
    if (isLocationChecked) {
      fetchHotels();
    }
  }, [isLocationChecked]);

  const onSubmit = (search: SearchWithFilters) => {
    if (search.input) {
      fetchHotelsWithInput(search);
    } else {
      fetchHotelsWithoutInput(search);
    }
  };

  const reserveRoom = () => {
    const data = {
      roomId: selectedRoom?.id,
      userId: authUser?.id,
      dateFrom: selectedDates?.fromDate,
      dateTo: selectedDates?.toDate
    };
    setIsModalOpen(false);
    const token = TOKEN.get();
    axios
      .post(`${config.API_URL}api/reservations/new`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(function (response) {
        if (response.data) {
          toast.success('Reservation Successful!');
          fetchHotels();
          dispatch(setLoading(false));
        } else {
          console.log('NOT GOOD');
          toast.error('There was an error with your reservation!');
          dispatch(setLoading(false));
        }
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        toast.error('There was an error with your reservation!');

        console.log('Error: ', error);
      });
  };

  const handleModalOpen = (index: number) => {
    const roomData = hotelData[index];
    setSelectedRoom({
      ...roomData,
      totalNights: totalNights
    });
    setIsModalOpen(true);
  };

  return (
    <ScreenWrapper>
      <ToastContainer />
      <div className={styles.mainContainer}>
        <div className={styles.searchWrapper}>
          <div className={styles.textAndFilterContainer}>
            <div className={styles.textContainer}>
              <Typography variant={'h4'}>Search</Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <div
                className={styles.filterContainer}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <img
                  src={filterLogo}
                  alt="filter"
                  style={{ height: '30px', width: '30px' }}
                />
                <Typography variant={'h5'}>FILTERI</Typography>
              </div>
              {isFilterOpen && (
                <div
                  style={{
                    width: '150px',
                    backgroundColor: '#ebebeb',
                    border: '1px solid #D4D4D4',
                    borderRadius: '23px',
                    zIndex: 999,
                    position: 'absolute',
                    top: '35px',
                    left: '-85px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    gap: '10px'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      borderRadius: '20px'
                    }}
                  >
                    <ControlledDatePicker control={control} name={'dateFrom'} />
                  </div>
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      borderRadius: '20px'
                    }}
                  >
                    <ControlledDatePicker control={control} name={'dateTo'} />
                  </div>
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      borderRadius: '20px'
                    }}
                  >
                    <ControlledSelect
                      control={control}
                      name={'capacity'}
                      label="Capacity"
                      options={[
                        {
                          label: '1',
                          value: 1
                        },
                        { label: '2', value: 2 },
                        { label: '3', value: 3 },
                        { label: '4', value: 4 },
                        { label: '5', value: 5 },
                        { label: '6', value: 6 },
                        { label: '7', value: 7 },
                        { label: '8', value: 8 },
                        { label: '9', value: 9 },
                        { label: '10', value: 10 }
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.searchInputWrapper}>
            <div className={styles.searchContainer}>
              <ControlledInput
                label="Search by name or city..."
                control={control}
                name="input"
              />
            </div>
            <Button onClick={handleSubmit(onSubmit)} variant={'contained'}>
              Search
            </Button>
          </div>
        </div>
        <div className={styles.filterAndCompanyWrapper}>
          <div className={styles.leftFiltersContainer}>
            <div style={{ marginBottom: '31px' }}>
              <Typography variant={'h5'}>Filteri</Typography>
            </div>
            <div className={styles.flexColumn}>
              <ControlledDatePicker
                control={control}
                name={'dateFrom'}
                label="Date from"
              />
              <ControlledDatePicker
                control={control}
                name={'dateTo'}
                label="Date to"
              />
              <ControlledSelect
                control={control}
                name={'capacity'}
                label="Capacity"
                options={[
                  {
                    label: '1',
                    value: 1
                  },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 },
                  { label: '5', value: 5 },
                  { label: '6', value: 6 },
                  { label: '7', value: 7 },
                  { label: '8', value: 8 },
                  { label: '9', value: 9 },
                  { label: '10', value: 10 }
                ]}
              />
            </div>
          </div>
          <div className={styles.companyContainer}>
            {hotelData.map((hotel, index) => (
              <div className={styles.imageCardStyle}>
                <ImageCard
                  headerText={`${hotel.hotelDTO.name}, ${hotel.hotelDTO.city}`}
                  subtitleText={`From: ${hotel.price}KM, Capacity: ${hotel.capacity}`}
                  onClick={() => handleModalOpen(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            backgroundColor: 'white',
            border: '2px solid black'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              padding: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant={'h5'}>Reservation Overview</Typography>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Typography variant="h6" sx={{ fontWeight: '700' }}>
                  Hotel:
                </Typography>
                <div
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.hotelDTO.name}
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Typography variant="h6" sx={{ fontWeight: '700' }}>
                  City:
                </Typography>
                <div
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.hotelDTO.city}
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Typography variant="h6" sx={{ fontWeight: '700' }}>
                  Country:
                </Typography>
                <div
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.hotelDTO.country}
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Typography variant="h6" sx={{ fontWeight: '700' }}>
                  Email:
                </Typography>
                <div
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.hotelDTO.emailAddress}
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Typography variant="h6" sx={{ fontWeight: '700' }}>
                  Phone:
                </Typography>
                <div
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.hotelDTO.phoneNumber}
                  </Typography>
                </div>
              </div>
            </div>
            <div
              style={{ width: '100%', height: '1px', background: 'black' }}
            ></div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <div style={{ width: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: '700' }}>
                    Room Description:
                  </Typography>
                </div>
                <div
                  style={{
                    width: 'auto'
                  }}
                >
                  <Typography variant="h6">
                    {selectedRoom?.description}
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Typography variant="h6" sx={{ fontWeight: '700' }}>
                  Capacity:
                </Typography>
                <div
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.capacity}
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <div style={{ width: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: '700' }}>
                    Price per night:
                  </Typography>
                </div>
                <div
                  style={{
                    width: 'auto'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.price}KM
                  </Typography>
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <div style={{ width: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: '700' }}>
                    Price for {selectedRoom?.totalNights} night(s):
                  </Typography>
                </div>
                <div
                  style={{
                    width: 'auto'
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {selectedRoom?.totalNights!! * selectedRoom?.price!!}KM
                  </Typography>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
                justifyContent: 'center'
              }}
            >
              <Button
                variant={'contained'}
                onClick={() => setIsModalOpen(false)}
                color={'secondary'}
              >
                Cancel
              </Button>
              <Button variant={'contained'} onClick={() => reserveRoom()}>
                Reserve
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </ScreenWrapper>
  );
};

export const getTotalNights = (dateFrom: Date, dateTo: Date) => {
  return differenceInDays(dateTo, dateFrom);
};
