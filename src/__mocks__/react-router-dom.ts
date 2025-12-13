export const HashRouter = ({ children }: any) => children;
export const MemoryRouter = ({ children }: any) => children;

export const Routes = ({ children }: any) => children;
export const Route = () => null;

export const Link = ({ children }: any) => children;

export const useNavigate = () => jest.fn();

export const useLocation = () => ({
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "test",
});
