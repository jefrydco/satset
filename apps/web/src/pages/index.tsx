import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  Box,
  Button,
  FilledInput,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import Grid2 from "@mui/material/Unstable_Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import ky from "ky";
import { IRunRequestPayload, IRunResponseData } from "../types";

const api = ky.create({ prefixUrl: `${API_HOST}/api/v1` });

export default function Home() {
  const [runRequestPayload, setRunRequestPayload] =
    useState<IRunRequestPayload>({
      name: "test1",
      loginUrl: "https://login.ajaib.co.id/login",
      usernameSelector: "input[name='email']",
      passwordSelector: "input[name='password']",
      submitSelector: "button[type='submit']",
      hasPin: true,
      pinSelector: ".pincode-input-text",
      username: "jefrydco@gmail.com",
      password: "YourSecretP@ssw0rd",
      pin: "0000",
      url: "https://invest.ajaib.co.id/#/saham/BBCA",
      count: 3,
    });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const {
    mutate: run,
    data: runResponseData,
    isLoading: isRunLoading,
  } = useMutation({
    mutationFn: (runPayload: IRunRequestPayload) => {
      return api.post("run", { json: runPayload }).json<IRunResponseData>();
    },
  });
  useEffect(() => {
    console.log(runResponseData);
  }, [runResponseData]);
  const handleInputChange =
    (
      prop: keyof IRunRequestPayload,
      selector: keyof HTMLInputElement = "value"
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRunRequestPayload((oldRequestPayload) => ({
        ...oldRequestPayload,
        [prop]: event.target[selector],
      }));
    };
  return (
    <>
      <Head>
        <title>SatSet</title>
      </Head>
      <Box sx={{ padding: "100px" }}>
        <Grid2 container spacing={2}>
          <Grid2 lg={6}>
            <Grid2 container spacing={4}>
              <Grid2 lg={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={runRequestPayload.name}
                  onChange={handleInputChange("name")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  label="Login URL"
                  fullWidth
                  value={runRequestPayload.loginUrl}
                  onChange={handleInputChange("loginUrl")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  label="Username Selector"
                  fullWidth
                  value={runRequestPayload.usernameSelector}
                  onChange={handleInputChange("usernameSelector")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  label="Password Selector"
                  fullWidth
                  value={runRequestPayload.passwordSelector}
                  onChange={handleInputChange("passwordSelector")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  label="Submit Selector"
                  fullWidth
                  value={runRequestPayload.submitSelector}
                  onChange={handleInputChange("submitSelector")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  label="Username"
                  fullWidth
                  value={runRequestPayload.username}
                  onChange={handleInputChange("username")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    label="Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <Tooltip
                          title={
                            isPasswordVisible
                              ? "Hide Password"
                              : "Show Password"
                          }
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setIsPasswordVisible(
                                (oldIsPasswordVisible) => !oldIsPasswordVisible
                              );
                            }}
                            onMouseDown={(event) => {
                              event.preventDefault();
                            }}
                            edge="end"
                          >
                            {isPasswordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    }
                    value={runRequestPayload.password}
                    onChange={handleInputChange("password")}
                  />
                </FormControl>
              </Grid2>
              <Grid2 lg={6}>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      value={runRequestPayload.hasPin}
                      onChange={handleInputChange("hasPin", "checked")}
                    />
                  }
                  label="Has PIN"
                />
              </Grid2>
              {runRequestPayload.hasPin ? (
                <>
                  <Grid2 lg={6}>
                    <TextField
                      label="PIN Selector"
                      fullWidth
                      value={runRequestPayload.pinSelector}
                      onChange={handleInputChange("pinSelector")}
                    />
                  </Grid2>
                  <Grid2 lg={6}>
                    <TextField
                      label="PIN"
                      fullWidth
                      value={runRequestPayload.pin}
                      onChange={handleInputChange("pin")}
                    />
                  </Grid2>
                </>
              ) : undefined}
              <Grid2 lg={6}>
                <TextField
                  label="URL"
                  fullWidth
                  value={runRequestPayload.url}
                  onChange={handleInputChange("url")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  label="Count"
                  fullWidth
                  type={"number"}
                  value={runRequestPayload.count}
                  onChange={handleInputChange("count")}
                />
              </Grid2>
              <Grid2 lg={12}>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  loading={isRunLoading}
                  onClick={() => {
                    run(runRequestPayload);
                  }}
                >
                  Submit
                </LoadingButton>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 lg={6}></Grid2>
        </Grid2>
      </Box>
    </>
  );
}
