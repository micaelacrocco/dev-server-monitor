import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  SignUpContainer,
  SignInContainer,
  Form,
  Title,
  Input,
  Button,
  GhostButton,
  Anchor,
  OverlayContainer,
  Overlay,
  LeftOverlayPanel,
  RightOverlayPanel,
  Paragraph
} from '../components';

function AuthForm() {
  const navigate = useNavigate();
  const [signIn, toggle] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  console.log('API URL:', process.env.REACT_APP_API_URL);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setSuccess('Registration successful! You can now sign in.');
      toggle(true); // Switch to sign in form
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      // Verificar que la respuesta contiene los datos de usuario
      console.log('Full response:', response.data); // Ver todos los datos de la respuesta
      console.log('User name:', response.data.user.name); // Accede al name dentro de user

      // Ahora guardamos el nombre y el token en localStorage
      if (response.data.user && response.data.user.name) {
        localStorage.setItem('name', response.data.user.name);
        localStorage.setItem('token', response.data.token);
        setSuccess('Login successful!');
        navigate('/dashboard');
      } else {
        setError('Name not received from backend');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };


  return (
    <Container>
      <SignUpContainer data-signin-in={signIn} style={{ padding: '0 100px' }}>
        <Form onSubmit={handleSignUp}>
          <Title style={{ color: '#2b2a49', fontSize: '42px' }}>Crear Cuenta</Title>
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          {success && <p style={{ color: 'green', fontSize: '14px' }}>{success}</p>}
          <Input
            style={{ backgroundColor: '#ffffff' }}
            type="text"
            placeholder="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            style={{ backgroundColor: '#ffffff' }}
            type="email"
            placeholder="Mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            style={{ backgroundColor: '#ffffff' }}
            type="password"
            placeholder="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Registrarme</Button>
        </Form>
      </SignUpContainer>

      <SignInContainer data-signin-in={signIn} style={{ padding: '0 100px' }}>
        <Form onSubmit={handleSignIn}>
          <Title style={{ color: '#2b2a49', fontSize: '42px' }}>Iniciar sesión</Title>
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          {success && <p style={{ color: 'green', fontSize: '14px' }}>{success}</p>}
          <Input
            style={{ backgroundColor: '#ffffff' }}
            type="email"
            placeholder="Mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            style={{ backgroundColor: '#ffffff' }}
            type="password"
            placeholder="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Iniciar sesión</Button>
        </Form>
      </SignInContainer>

      <OverlayContainer data-signin-in={signIn}>
        <Overlay data-signin-in={signIn}>
          <LeftOverlayPanel data-signin-in={signIn} style={{ padding: '0 100px' }}>
            <Title>¡Bienvenido de nuevo!</Title>
            <Paragraph>
              Accedé con tus credenciales para comenzar a monitorear el estado de tus servidores en tiempo real.
            </Paragraph>
            <GhostButton onClick={() => toggle(true)}>
              Iniciar sesión
            </GhostButton>
          </LeftOverlayPanel>

          <RightOverlayPanel data-signin-in={signIn} style={{ padding: '0 100px' }}>
            <Title>¡Hola!</Title>
            <Paragraph>
              Crea tu cuenta y empezá a recibir alertas sobre el rendimiento de tus servidores.
            </Paragraph>
            <GhostButton onClick={() => toggle(false)}>
              Crear Cuenta
            </GhostButton>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
}

export default AuthForm;