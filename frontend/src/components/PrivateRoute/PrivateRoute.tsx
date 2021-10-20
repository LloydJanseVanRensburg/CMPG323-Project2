import { Route, Redirect } from 'react-router-dom';

interface Props {
  component: any;
  [x: string]: any;
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('authToken');

  return (
    <Route
      {...rest}
      render={(props) =>
        !token ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
