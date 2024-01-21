export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  userType: string;
  isAuthorized: boolean;
  username: string;
};

export type UserRequestDto = {
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  userType: string;
  address: string;
  password: string;
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type NavbarItems = {
  value: string;
};

export type MyBusinessItems = {
  key: string;
  value: string;
};

export type MyBusiness = {
  title: string;
  submenuItems: MyBusinessItems[];
};

export type SearchWithFilters = {
  input?: string | undefined;
  dateFrom: Date;
  dateTo: Date;
  capacity: number;
};

export type HotelDto = {
  id: string;
  ownerId: string;
  name: string;
  city: string;
  country: string;
  emailAddress: string;
  phoneNumber: string;
  ownerName: string;
};

export type RoomDto = {
  id: string;
  hotelId: string;
  price: number;
  capacity: number;
  description: string;
  hotelDTO: HotelDto;
};

export type FromAndToDate = {
  fromDate: string;
  toDate: string;
};
