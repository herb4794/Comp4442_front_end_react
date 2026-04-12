export type AuthUser = {
  email: string;
  role: number;
};

export type ContextTypes = {
  user: string;
  loginStatus: boolean;
  auth: AuthUser;
  setAuth: (auth: AuthUser) => void;
  signOut: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
  loading: boolean;
};

export type Room = {
  id: number;
  title?: string;
  name?: string;
  price: number;
  description?: string;
};
export type ItemProps = {
  room: Room;
  images: string;
};


export type Booking = {
  id: number;
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
};
