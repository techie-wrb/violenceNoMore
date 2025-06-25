import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext, AuthProvider } from 'state/index';
import SignUp from 'screens/SignUp/index';

const email = 'test@test.com';
const password = '12345678';
const username = 'celeste';
const token = "DUMMY_TOKEN_FOR_TESTS";

const navigate = jest.fn();
const addListener = jest.fn();
describe('Sign Up screen', () => {
  it('should match snapshot', () => {
    const result = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    ).toJSON();
    expect(result).toMatchSnapshot();
  });
  it('should render default screen elements', () => {
    const { getAllByText, getByPlaceholderText, queryByText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );
    expect(getAllByText(/sign up/i).length).toBe(2);
    expect(getByPlaceholderText(/username/i));
    expect(getByPlaceholderText(/email/i));
    expect(getByPlaceholderText(/password/i));
    expect(queryByText(/Have an account? Go to login/i));
  });

  it('should show error messages on empty inputs submit', async () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.press(getByTestId('signUp'));

    await waitFor(() => expect(getByText(/please enter your username/i)));
    await waitFor(() => expect(getByText(/please enter an email/i)));
    await waitFor(() =>
      expect(getByText(/please enter 8 characters password/i))
    );
  });
  it('should not show error message on valid username', async () => {

    const { getByTestId, queryByText, getByPlaceholderText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/username/i), username);
    fireEvent.press(getByTestId('signUp'));

    await waitFor(() =>
      expect(queryByText(/please enter your username/i)).toBeNull()
    );
  });
  it('should show error on invalid password', async () => {

    const invalidPassword = 'one';
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/password/i), invalidPassword);
    fireEvent.press(getByTestId('signUp'));

    await waitFor(() =>
      expect(getByText(/please enter 8 characters password/i))
    );
  });
  it('should not show error on valid password', async () => {

    const { getByTestId, queryByText, getByPlaceholderText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/password/i), password);
    fireEvent.press(getByTestId('signUp'));

    await waitFor(() =>
      expect(queryByText(/please enter 8 characters password/i)).toBeNull()
    );
  });

  it('should show error on invalid email', async () => {

    const invalidEmail = 'test.com';
    const { getByTestId, getByText, queryByPlaceholderText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(queryByPlaceholderText(/email/i), invalidEmail);
    fireEvent.press(getByTestId('signUp'));

    await waitFor(() => expect(getByText(/email must be a valid email/i)));
  });
  it('should not show error on valid email', async () => {

    const { getByTestId, queryByText, getByPlaceholderText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/email/i), email);
    fireEvent.press(getByTestId('signUp'));

    await waitFor(() =>
      expect(queryByText(/email must be a valid email/i)).toBeNull()
    );
  });
  it('should navigate to login screen on press "go to login"', async () => {

    const { getByText } = render(
      <AuthProvider>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.press(getByText(/go to login/i));

    await expect(navigate).toHaveBeenCalledWith('Login');
  });
  it('should handle valid input onSubmit and call signup action creator function with email, password and  username', async () => {

    const state = {
      isLoggedIn: true,
      errorMessage: '',
      isFirstLaunch: false,
      token,
    };
    const loginSignup = jest.fn();

    const { getByTestId, getByPlaceholderText } = render(
      <AuthContext.Provider value={{ state, loginSignup }}>
        <SignUp navigation={{ navigate, addListener }} />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText(/username/i), username);
    fireEvent.changeText(getByPlaceholderText(/email/i), email);
    fireEvent.changeText(getByPlaceholderText(/password/i), password);
    fireEvent.press(getByTestId('signUp'));
    const flushPromises = () => new Promise(setImmediate);
    await flushPromises();

    expect(loginSignup).toBeCalledWith({ email, password, username });
    expect(navigate).toBeCalledWith('User');
  });
});
