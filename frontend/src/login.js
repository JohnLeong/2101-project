import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Div,
  Input,
  Icon,
  Image,
  Text,
  Label,
  Checkbox,
  Anchor,
  ThemeProvider,
  DefaultTheme,
  StyleReset
} from "atomize";

import "./styles.css";

const theme = {
  ...DefaultTheme,
  fontFamily: {
    ...DefaultTheme.fontFamily,
    primary: `'Lato', sans-serif;`
  }
};

function App() {
  const [isPasswordVisible, togglePasswordVisibility] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <StyleReset />

      <link
        href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap"
        rel="stylesheet"
      />
      <Div>
        <Text
          tag="h1"
          textSize="subheader"
          m={{ t: "3rem" }}
          textAlign="center"
        >
          Sign in to continue to Atomize
        </Text>
        <Div d="flex" flexDir="column" align="center" w="80%" m="0 auto">
          <Image
            m={{ t: "2rem", b: "2rem" }}
            h="40px"
            src="https://firebasestorage.googleapis.com/v0/b/pawan-dev.appspot.com/o/logo.svg?alt=media"
          />
          <form classsName="form-signin" style={{ width: "100%" }}>
            <Input placeholder="Email" m={{ t: "1.5rem" }} />
            <Input
              m={{ t: "1rem" }}
              placeholder="Password"
              type={isPasswordVisible ? "text" : "password"}
              suffix={
                <Button
                  type="button"
                  pos="absolute"
                  onClick={() => togglePasswordVisibility(!isPasswordVisible)}
                  bg="transparent"
                  w="3rem"
                  top="0"
                  right="0"
                  rounded={{ r: "md" }}
                >
                  <Icon
                    name={isPasswordVisible ? "EyeSolid" : "Eye"}
                    color={isPasswordVisible ? "danger800" : "success800"}
                    size="16px"
                  />
                </Button>
              }
            />
            <Div d="flex" align="center" m={{ t: "1rem" }}>
              <Div d="flex" flexGrow="1">
                <Button bg="info700" type="submit">
                  Sign in
                </Button>
              </Div>
              <Label align="center" textWeight="600">
                <Checkbox
                  onChange={e =>
                    this.setState({ rememberMe: e.target.checked })
                  }
                  checked={true}
                  inactiveColor="success400"
                  activeColor="success700"
                  size="24px"
                />
                Remember Me
              </Label>
            </Div>
          </form>
          <Div m={{ t: "3rem" }} textAlign="center">
            <Anchor href="#" d="block">
              Need help?{" "}
            </Anchor>
            <Anchor href="#" d="block" m=".2rem">
              Create an account{" "}
            </Anchor>
          </Div>
        </Div>
      </Div>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
