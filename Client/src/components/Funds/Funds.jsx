import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import bgPic from "/bg_pic.jpeg"; // Import the image
import Swal from "sweetalert2"; // Import swal
import { useAuth } from "../Authorisation/Auth";
import {
  fetchCurrentFunds,
  fetchUsername,
  addFunds,
  withdrawFunds,
} from "./apiCalls";
const FundsPage = () => {
  const [currentFunds, setCurrentFunds] = useState(null); // Initial funds
  const [username, setUsername] = useState("-Username-"); // Initial username
  const { user, isLoggedIn, token } = useAuth();
  const userId = isLoggedIn ? user.user_id : null;
  const [actionType, setActionType] = useState(null);
  const [handleFunds, setHandleFunds] = useState(() => {});
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState(null);

  const handleAddFunds = async () => {
    console.log("Adding funds");

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount!");
      return;
    }
    let money = await addFunds(userId, token, amount);
    if (money) {
      setCurrentFunds(money);
      setOpenDialog(false);
      setAmount(null);
    }
  };

  const handleWithdrawFunds = async () => {
    console.log("Withdrawing funds");

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount!");
      return;
    }
    if (parseFloat(amount) > currentFunds) {
      setError("Insufficient Funds!");
      return;
    }
    let money = await withdrawFunds(userId, token, amount);
    if (money) {
      setCurrentFunds(money);
      setOpenDialog(false);
      setAmount(null);
    }
  };

  const handleFundsConfirmation = (e) => {
    Swal.fire({
      text: "Are you sure you wish to " + e.target.textContent + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenDialog(true);
        setActionType(e.target.textContent[0]);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const money = await fetchCurrentFunds(userId, token);
      if (money) setCurrentFunds(money);
    })();
    (async () => {
      const uname = await fetchUsername(userId, token);
      if (uname) setUsername(uname);
    })();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        background: `url(${bgPic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12} align="center" style={{ marginTop: "100px" }}>
          <Typography
            variant="h4"
            style={{
              marginTop: "30px",
              marginBottom: "20px",
              color: "black",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {username !== null ? `Welcome, ${username}!` : "Loading..."}
          </Typography>
          <Typography
            variant="h4"
            style={{
              marginBottom: "20px",
              color: "black",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Current Balance:{" "}
            {currentFunds !== null
              ? `$${currentFunds.toFixed(2)}`
              : "Loading..."}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="contained"
                style={{ backgroundColor: "primary", color: "white" }}
                size="large"
                onClick={handleFundsConfirmation}
              >
                Deposit Funds
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{ backgroundColor: "#FF5252", color: "white" }}
                size="large"
                onClick={handleFundsConfirmation}
              >
                Withdraw Funds
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {actionType != null
              ? actionType == "D"
                ? "Deposit Funds"
                : "Withdraw Funds"
              : "Nothing"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Enter Amount"
              variant="outlined"
              onChange={handleAmountChange}
              margin="normal"
            />
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={() => {
                if (actionType == "D") {
                  handleAddFunds();
                } else {
                  handleWithdrawFunds();
                }
              }}
              variant="contained"
              color="primary"
            >
              {actionType != null
                ? actionType == "D"
                  ? "Add"
                  : "Withdraw"
                : "Nothing"}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};

export default FundsPage;
