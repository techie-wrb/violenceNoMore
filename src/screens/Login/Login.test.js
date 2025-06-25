import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext, AuthProvider } from 'state/index';
import Login from 'screens/Login/index';

const email = 'test@test.com';
const password = '12345678';
const navigate = jest.fn();
const addListener = jest.fn();
const token = "DUMMY_TOKEN_FOR_TESTS";

describe('Login screen', () => {
  it('should match snapshot', () => {
    const result = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    ).toJSON();
    expect(result).toMatchSnapshot();
  });
  it('should render default screen elements', () => {
    const { getAllByText, getByText, getByPlaceholderText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );
    expect(getAllByText(/log in/i).length).toBe(2);
    expect(getByPlaceholderText(/email/i));
    expect(getByPlaceholderText(/password/i));
    expect(getByText(/Go to sign up/i));
  });

  it('should show error messages on empty inputs submit', async () => {
    const { getByTestId, findByText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.press(getByTestId('logIn'));

    expect(await findByText(/please enter an email/i)).toBeTruthy();
    expect(
      await findByText(/please enter 8 characters password/i)
    ).toBeTruthy();
  });

  it('should show error on invalid password', async () => {
    const invalidPassword = 'one';

    const { getByTestId, getByText, getByPlaceholderText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/password/i), invalidPassword);
    fireEvent.press(getByTestId('logIn'));

    await waitFor(() =>
      expect(getByText(/please enter 8 characters password/i)).toBeTruthy()
    );
  });

  it('should not show error on valid password', async () => {
    const { getByTestId, queryByText, getByPlaceholderText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/password/i), password);
    fireEvent.press(getByTestId('logIn'));

    await waitFor(() =>
      expect(queryByText(/please enter 8 characters password/i)).toBeNull()
    );
  });

  it('should show error on invalid email', async () => {
    const invalidEmail = 'test.com';
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/email/i), invalidEmail);
    fireEvent.press(getByTestId('logIn'));

    await waitFor(() =>
      expect(getByText(/email must be a valid email/i)).toBeTruthy()
    );
  });
  it('should not show error on valid email', async () => {
    const { getByTestId, queryByText, getByPlaceholderText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText(/email/i), email);
    fireEvent.press(getByTestId('logIn'));

    await waitFor(() =>
      expect(queryByText(/email must be a valid email/i)).toBeNull()
    );
  });
  it('should navigate to sign up on press "go to sign up"', async () => {
    const { getByText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.press(getByText(/Do not have an account/i));

    await expect(navigate).toHaveBeenCalledWith('Sign Up');
  });
  it('should navigate to home screen on press "proceed without login"', async () => {
    const { getByText } = render(
      <AuthProvider>
        <Login navigation={{ navigate, addListener }} />
      </AuthProvider>
    );

    fireEvent.press(getByText(/proceed without login/i));

    await expect(navigate).toHaveBeenCalledWith('BottomTabNavigator', {
      screen: 'Home',
    });
  });
  it('should handle valid input onSubmit and call login action creator function with email and password', async () => {
    const state = {
      isLoggedIn: true,
      errorMessage: '',
      isFirstLaunch: false,
      token,
    };
    const loginSignup = jest.fn();

    const { getByTestId, getByPlaceholderText } = render(
      <AuthContext.Provider value={{ state, loginSignup }}>
        <Login navigation={{ navigate, addListener }} />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText(/email/i), email);
    fireEvent.changeText(getByPlaceholderText(/password/i), password);
    fireEvent.press(getByTestId('logIn'));
    const flushPromises = () => new Promise(setImmediate);
    await flushPromises();

    expect(loginSignup).toBeCalledWith({ email, password });
    expect(navigate).toBeCalledWith('User');
  });
});
