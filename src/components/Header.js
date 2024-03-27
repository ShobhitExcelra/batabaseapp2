import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { loginRequest } from "../config/authConfig";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Navigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import useSetAccessToken from "./hooks/useSetAccessToken";
import { Link } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

function Header() {
  useSetAccessToken();
  const userInfo = useSelector((state) => state.user);
  const { instance } = useMsal();
  const dispatch = useDispatch();
  // handle other errors
  const activeAccount = instance.getActiveAccount()
    ? instance.getActiveAccount()
    : JSON.parse(localStorage.getItem("userInfo"));
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [userName, setUserName] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenu, setSubMenu] = useState([]);
  const open = Boolean(anchorEl);
  const menuList = Object.values(Navigation);
  const isAuthenticated = useIsAuthenticated();

  const handleClick = (event, page) => {
    setAnchorEl(event.currentTarget);
    setSubMenu(page.menus);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (activeAccount && activeAccount.name) {
      setUserName(activeAccount.name.split(" ")[0] || activeAccount.name.split("-")[0]);
    } else if (activeAccount && activeAccount.firstName) {
      setUserName(activeAccount.firstName);
    } else {
      setUserName(null);
    }
  }, [activeAccount]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogOut = (loginType) => {
    instance.logoutRedirect(loginRequest);
    dispatch(removeUser());
    localStorage.removeItem("userInfo");
    localStorage.removeItem("batabaseAPI");
    localStorage.removeItem('formData');
  };

  return (
    <AppBar
      className="appbarHeader"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div>
            <img
              alt="logo"
              style={{ width: "150px" }}
              src="https://static.wixstatic.com/media/2079da_b56fb35cab1b43e5b05e8ac45ad662eb~mv2.png/v1/fill/w_230,h_71,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/paratusLogoLightground.png"
            />
          </div>
          {(isAuthenticated || activeAccount) && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none"}}}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {menuList.map((page) => (
                    <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                      <Typography sx={{ color: "black" }} textAlign="center">
                        {page.label}
                      </Typography>
                    </MenuItem>
                  ))}

                  
                </Menu>
              </Box>
              <div className="headerMenu">
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  {menuList.map((page, index) => (
                    <div>
                      <Button
                        key={page.label}
                        onClick={(event) => {
                          handleClick(event, page);
                        }}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        <Link
                          to={page.path}
                          style={{
                            color: "black",
                            textTransform: "capitalize",
                            margin: "0 10px 0 10px",
                            fontSize: "1.1rem",
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                        >
                          {page.label}
                        </Link>
                      </Button>
                    </div>
                  ))}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    {subMenu?.map((items) => (
                      <MenuItem onClick={handleClose}>
                        {" "}
                        <>
                          {items.label === "NextFlow Tower" ? (
                            <Link
                              to={items.path}
                              target="_blank"
                              style={{
                                color: "black",
                                textTransform: "capitalize",
                                margin: "0 10px 0 10px",
                                fontSize: "1.1rem",
                                textDecoration: "none",
                                fontWeight: 700,
                              }}
                            >
                              {items.label}
                            </Link>
                          ) : (
                            <Link
                              to={items.path}
                              style={{
                                color: "black",
                                textTransform: "capitalize",
                                margin: "0 10px 0 10px",
                                fontSize: "1.1rem",
                                textDecoration: "none",
                                fontWeight: 700,
                              }}
                            >
                              {items.label}
                            </Link>
                          )}
                        </>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </div>
              <Box sx={{ flexGrow: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "black",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: 510,
                      fontSize: "1.1rem",
                      paddingTop: "5px",
                    }}
                  >
                    Welcome {userName} |{" "}
                  </h5>{" "}
                  &nbsp;{" "}
                  <Link
                    style={{
                      color: "black",
                      textTransform: "capitalize",
                      fontSize: "1.1rem",
                      textDecoration: "none",
                      margin: "2px",
                    }}
                    onClick={handleLogOut}
                  >
                    <h5
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        paddingTop: "2px",
                      }}
                    >
                      Logout
                    </h5>
                  </Link>
                </Typography>
              </Box>
              {/* <Box>
                <>
                  <Link
                    style={{
                      color: "black",
                      textTransform: "capitalize",
                      fontSize: "22px",
                      textDecoration: "none",
                    }}
                    onClick={handleLogOut}
                  >
                    Logout
                  </Link>
                </>
              </Box> */}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
