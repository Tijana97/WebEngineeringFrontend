class Token {
  public key: string;

  public get = (): string | undefined => {
    const token = localStorage.getItem(this.key);
    if (token) {
      return token;
    }
    return undefined;
  };

  public set = (token: string) => {
    localStorage.setItem(this.key, token);
  };

  public remove = () => {
    localStorage.removeItem(this.key);
  };

  constructor() {
    this.key = 'token';
  }
}

const TOKEN = new Token();
export { TOKEN };
