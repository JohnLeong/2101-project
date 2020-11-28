import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Cookies from 'js-cookie'
import { loginUrl, modulesUrl } from '../routes';
import { useHistory } from 'react-router-dom';
import { getClaims } from '../TokenClaims';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const LoginPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting === false) {
      setSubmitting(true);
      fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Invalid credentials");
          }
        })
        .then((jsonData) => {
          var token = jsonData;
          console.log(jsonData);

          //Add token to cookies
          Cookies.set("token", token.accessToken);

          //Redirect
          const role = getClaims().role;
          if (role === 1) {          //Lecturer
            history.push(modulesUrl);
          } else if (role === 2) {   //Student
            history.push("/student/gamification");
          } else {
            history.push("/login");
          }
        })
        .catch((err) => {
          console.error("Login error: " + err);
          setSubmitting(false);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(evt) => setPassword(evt.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <p>All account passwords are password123</p>
          <p>Lecturer</p>
          <p>julianntacy@sit.singaporetech.edu.sg</p>
          <p>roscoeagosta@sit.singaporetech.edu.sg</p>
          <p>Student</p>
          <p>carmelacallicoat@sit.singaporetech.edu.sg</p>
          <p>darylvittetoe@sit.singaporetech.edu.sg</p>
          <p>susannahmcgibbon@sit.singaporetech.edu.sg</p>
        </form>
      </div>
    </Container>
  );
}