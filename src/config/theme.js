export default {
  typography: {
    // In Japanese the characters are usually larger.
    fontSize: "12px",
  },
  palette: {
    primary: {
      main: "rgb(0,171,56)",
      // "#28ce98",
      dark: "#0ba360",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff",
      contrastText: "#000",
    },
    background: {
      default: "#F4F7FB",
    },
  },
  overrides: {
    // MuiDivider: {
    //   root: {
    //     marginBottom: "24px",
    //     marginTop: "8px",
    //   },
    // },
    MuiStepper: {
      root: {
        paddingBottom: "0px",
      },
    },
    MuiStepIcon: {
      text: {
        fontSize: "12px",
      },
    },
    MuiCard: {
      root: {
        marginTop: "24px",
      },
    },
    MuiFormControl: {
      root: {
        // paddingBottom: "4px",
        // marginTop: "8px"
      },
      fullWidth: {
        width: "75% !important",
      }
    },
    MuiTableCell: {
      body: {
        fontSize: "14px",
      },
    },
    MuiTypography: {
      title: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "20px",
        fontWeight: 400,
        letterSpacing: "0.83px",
        lineHeight: "24px",
      },
      caption: {
        fontSize: "12px",
      },
      headline: {
        fontSize: "24px",
      },
      body1: {
        color: "rgba(0, 0, 0, 0.60)",
        fontFamily: "Roboto",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px"
      },
      body2: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "16px",
        fontWeight: 400,
        letterSpacing: "0.67px",
        lineHeight: "19px",
      },
      subheading: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "18px",
        letterSpacing: "0.75px",
        fontWeight: 400,
        lineHeight: "20px",
      },
    },
    MuiInput: {
      input: {
        fontSize: "16px",
        fontFamily:"montserrat_medium"
      }
    },
    MuiFormLabel: {
      root:{
        fontFamily:"montserrat_medium",
        fontSize: "12px"
      }
    },
    MuiMenuItem: {
      root: {
        fontSize: "16px",
      },
    },
    MuiInputLabel: {
      animated: {
        fontSize: "16px",
        fontWeight: 500,
      },
    },
    MuiButton: {
      label: {
        fontSize: "14px",
        fontFamily:"quicksand_bold"
      },
    },
    MuiListItemText: {
      primary: {
        fontSize: "14px",
        fontWeight: 500,
        fontFamily:"quicksand_medium"
      },
    },
    MuiList: {
      root: {
        width:"80%"
      },
    }
  }
}
