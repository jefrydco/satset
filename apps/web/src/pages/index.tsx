import { useMutation } from "@tanstack/react-query";
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField,
  Tooltip as MUITooltip,
} from "@mui/material";

import Head from "next/head";
import Grid2 from "@mui/material/Unstable_Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import ky from "ky";

import {
  IRunRequestPayload,
  IRunResponseData,
  IRunStatusProgressResponseDataEnum,
  IRunStatusRequestPayload,
  IRunStatusResponseData,
} from "../types";
import { Chart } from "../components/Chart/Chart";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
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
      url: "https://invest.ajaib.co.id/#/saham/BBRI",
      count: "3",
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
  const {
    mutate: runStatus,
    data: runStatusResponseData,
    isLoading: isRunStatusLoading,
  } = useMutation({
    mutationFn: (runStatusPayload: IRunStatusRequestPayload) => {
      return api
        .post("run/status", { json: runStatusPayload })
        .json<IRunStatusResponseData>();
    },
  });
  const isLoading =
    isRunLoading ||
    runStatusResponseData?.progress ===
      IRunStatusProgressResponseDataEnum.IN_PROGRESS;
  const intervalId = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (runResponseData) {
      runStatus({ measureMongoId: runResponseData.measureMongoId });
      intervalId.current = setInterval(() => {
        runStatus({ measureMongoId: runResponseData.measureMongoId });
      }, 15000);
    }
    return () => {
      clearInterval(intervalId.current);
    };
  }, [runResponseData]);
  useEffect(() => {
    if (
      runStatusResponseData?.progress ===
      IRunStatusProgressResponseDataEnum.COMPLETED
    ) {
      clearInterval(intervalId.current);
    }
  }, [runStatusResponseData]);
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
                  disabled={isLoading}
                  label="Name"
                  fullWidth
                  value={runRequestPayload.name}
                  onChange={handleInputChange("name")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  disabled={isLoading}
                  label="Login URL"
                  fullWidth
                  value={runRequestPayload.loginUrl}
                  onChange={handleInputChange("loginUrl")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  disabled={isLoading}
                  label="Username Selector"
                  fullWidth
                  value={runRequestPayload.usernameSelector}
                  onChange={handleInputChange("usernameSelector")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  disabled={isLoading}
                  label="Password Selector"
                  fullWidth
                  value={runRequestPayload.passwordSelector}
                  onChange={handleInputChange("passwordSelector")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  disabled={isLoading}
                  label="Submit Selector"
                  fullWidth
                  value={runRequestPayload.submitSelector}
                  onChange={handleInputChange("submitSelector")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  disabled={isLoading}
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
                    disabled={isLoading}
                    label="Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <MUITooltip
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
                        </MUITooltip>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                      label="PIN Selector"
                      fullWidth
                      value={runRequestPayload.pinSelector}
                      onChange={handleInputChange("pinSelector")}
                    />
                  </Grid2>
                  <Grid2 lg={6}>
                    <TextField
                      disabled={isLoading}
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
                  disabled={isLoading}
                  label="URL"
                  fullWidth
                  value={runRequestPayload.url}
                  onChange={handleInputChange("url")}
                />
              </Grid2>
              <Grid2 lg={6}>
                <TextField
                  disabled={isLoading}
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
                  loading={isLoading}
                  onClick={() => {
                    run(runRequestPayload);
                  }}
                >
                  Submit
                </LoadingButton>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 lg={6} md={12} sm={12} xs={12}>
            {runStatusResponseData ? (
              <Chart
                dataSource={runStatusResponseData.chart.dataset}
                series={[
                  {
                    type: "line",
                    seriesLayoutBy: "row",
                  },
                  {
                    type: "line",
                    seriesLayoutBy: "row",
                  },
                  {
                    type: "line",
                    seriesLayoutBy: "row",
                  },
                  {
                    type: "line",
                    seriesLayoutBy: "row",
                  },
                  {
                    type: "line",
                    seriesLayoutBy: "row",
                  },
                ]}
              />
            ) : undefined}
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
}
