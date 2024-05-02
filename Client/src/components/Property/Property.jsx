import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  CardMedia,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import defpropertyimg from "/prop.webp";
import "./Property.css"; // Import the CSS file for styling
import { useAuth } from "../Authorisation/Auth";
import Swal from "sweetalert2";
import {
  actionFromWatchlist,
  getPropertyById,
  fetchOrder,
} from "../UserList/APIcalls";
import { Order } from "./apiCalls";

function BasicTable({ buyBids, sellBids }) {
  // Sort rows by buybid in ascending order and sellbid in descending order
  // State to hold the sorted rows
  const [sortedRows, setSortedRows] = useState([]);

  const combinedBids = [];
  for (let i = 0; i < Math.max(buyBids.length, sellBids.length); i++) {
    combinedBids.push({
      buyBid: buyBids[i] || null,
      sellBid: sellBids[i] || null,
    });
  }

  return (
    <TableContainer component={Paper} className="Table">
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="Table-cell">Top buy bids</TableCell>
            <TableCell className="Table-cell">Top sell bids</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combinedBids.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.buyBid !== null ? row.buyBid : "-"}
              </TableCell>
              <TableCell>{row.sellBid !== null ? row.sellBid : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Property() {
  const defaultProperty = {
    name: "Property Title",
    category: "Property Category",
    location: "Property Location",
    ltp: "Property LTP",
    description:
      "Welcome to your dream home! Nestled in the heart of a vibrant community, this charming property boasts modern comforts and classic appeal.",
  };

  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(defaultProperty);
  const [buyBids, setBuyBids] = useState([]);
  const [sellBids, setSellBids] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(null);
  const [propertyimg, setPropertyimg] = useState(defpropertyimg);
  const { isLoggedIn, user, token } = useAuth();
  const gridRef = useRef(null);
  const userId = isLoggedIn ? user.user_id : null;
  if (!propertyId) {
    alert("Property does not exist");
    return useEffect(() => {
      navigate("/funds");
    }, []);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");
  };

  const handleAmountChange = async (event) => {
    setAmount(event.target.value);
    setError("");
  };

  const handleConfirmation = (e) => {
    let target = e.target.textContent.split(" ");
    Swal.fire({
      text: "Are you sure you wish to place " + e.target.textContent + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        // if (target[0] == "Market") {
        handleMarketOrder(target[2]);
        // } else {
        // handleLimitOrder(target[2]);
        // }
      }
    });
  };

  const handleMarketOrder = (type) => {
    if (type == "Buy") {
      setAmount(sellBids[0]);
    } else {
      setAmount(buyBids[0]);
    }
    Order(userId, propertyId, amount, token, "market", type.toLowerCase());
  };
  const handleLimitOrder = (e) => {
    setOpenDialog(true);

    if (e.target.textContent.split(" ")[2] == "Buy") {
      setActionType("buy");
    } else {
      setActionType("sell");
    }
  };

  useEffect(() => {
    const handleClick = () => {
      if (!isLoggedIn) navigate("/login");
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener("click", handleClick, true);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener("click", handleClick);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch property data from the server based on propertyId
    const fetchData = async () => {
      let data = await getPropertyById(propertyId);
      if (data) {
        setProperty(data);
      }
      data = await fetchOrder("buy", propertyId);
      if (data) {
        setBuyBids(data);
      }
      data = await fetchOrder("sell", propertyId);
      if (data) {
        setSellBids(data);
      }
    };
    fetchData();
    // Fetch new bids every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [propertyId]);

  return (
    <Container className="property-container" sx={{ mt: 4 }}>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {actionType != null
            ? actionType == "buy"
              ? "Enter Buy Bid"
              : "Enter Sell Bid"
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
              if (!/^\d+$/.test(amount)) {
                setError("Please enter a valid amount!");
                return;
              }
              Order(userId, propertyId, amount, token, "limit", actionType);
              setOpenDialog(false);
              setAmount(null);
            }}
            variant="contained"
            color="primary"
          >
            Place Bid
          </Button>
        </DialogActions>
      </Dialog>
      <div className="property-content">
        <CardMedia
          component="img"
          image={property.image || propertyimg}
          alt="property image"
          sx={{ width: "50%", objectFit: "cover" }}
          className="property-image"
        />
        <div className="property-buttons">
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            ref={gridRef}
          >
            <Grid item style={{ minWidth: "100%" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "primary", color: "white" }}
                size="large"
                sx={{ minWidth: "100%" }}
                onClick={handleConfirmation}
              >
                Market Order Buy
              </Button>
            </Grid>
            <Grid item style={{ minWidth: "100%" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "primary", color: "white" }}
                size="large"
                sx={{ minWidth: "100%" }}
                onClick={handleConfirmation}
              >
                Market Order Sell
              </Button>
            </Grid>
            <Grid item style={{ minWidth: "100%" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "primary", color: "white" }}
                size="large"
                sx={{ minWidth: "100%" }}
                onClick={handleLimitOrder}
              >
                Limit Order Buy
              </Button>
            </Grid>

            <Grid item style={{ minWidth: "100%" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "primary", color: "white" }}
                size="large"
                sx={{ minWidth: "100%" }}
                onClick={handleLimitOrder}
              >
                Limit Order Sell
              </Button>
            </Grid>

            <Grid item style={{ minWidth: "100%" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "white", color: "blue" }}
                size="large"
                sx={{ minWidth: "100%" }}
                onClick={() => {
                  actionFromWatchlist(userId, propertyId, token, "add");
                  Swal.fire(
                    "Added!",
                    "Property has been added to Watchlist.",
                    "success"
                  );
                }}
              >
                Add to Watchlist
              </Button>
            </Grid>
            <Grid item style={{ minWidth: "100%" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "white", color: "blue" }}
                size="large"
                sx={{ minWidth: "100%" }}
                onClick={() => {
                  actionFromWatchlist(userId, propertyId, token, "remove");
                  Swal.fire(
                    "Removed!",
                    "Property has been deleted from Watchlist.",
                    "success"
                  );
                }}
              >
                Remove from Watchlist
              </Button>
            </Grid>

            <Grid item minWidth="100%">
              <BasicTable buyBids={buyBids} sellBids={sellBids} />
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="property-details">
        <Typography variant="h4" className="property-title" gutterBottom>
          {property.name}
        </Typography>
        <Typography variant="h6" className="property-category" gutterBottom>
          Category: {property.category}
        </Typography>
        <Typography
          variant="h6"
          className="property-location"
          color="black"
          gutterBottom
        >
          Location: {property.location}
        </Typography>
        <Typography
          variant="subtitle1"
          className="property-ltp"
          color="black"
          gutterBottom
        >
          Last Traded Price: {property.ltp}
        </Typography>
        <Typography
          variant="body1"
          className="property-description"
          gutterBottom
        >
          {property.description}
        </Typography>
      </div>
    </Container>
  );
}
