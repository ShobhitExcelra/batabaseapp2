import React from 'react'
import Header from './Header'
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBatabase } from "../../src/utils/batabaseSlice";
import {imagesFormat} from '../../src/config/mainConfig';
import "../App.css";
import { Link } from "react-router-dom";
import { Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import useGetAccessToken from './hooks/useGetAccessToken';
import useDocumentTitle from './hooks/useDocumentTitle';
import Footer from './Footer';
const DataLibrary = () => {
  useDocumentTitle('Data Library [bat-studio]')
  const dispatch = useDispatch();
  const batabaseInfo = useSelector((state) => state.batabase);
  let token = useGetAccessToken();
  let [batabases, setBataBases] = useState(batabaseInfo ? batabaseInfo.batabaseAPI : (localStorage.getItem('batabaseAPI') ? JSON.parse(atob(localStorage.getItem('batabaseAPI'))):[]));
  let [text, setText] = useState();
  let [switchView,setSwitchView] = useState(true)
  let [isActive, setActive] = useState(false);

  useEffect(()=>{
    if(batabases.length === 0){
      getbatabaseData()
    }
  },[])

  const getbatabaseData = () => {
    axios
      .get(`${process.env.REACT_APP_API_ROOT}/batabases`, {
        headers: {
          accept: "application/json",
          authorization: token,
        },
      })
      .then((response) => {
        setBataBases(response.data);
        dispatch(addBatabase({ batabaseAPI: response.data }));
        localStorage.setItem("batabaseAPI", btoa(JSON.stringify(response.data)));
      })
      .catch((err) => console.error(err));
  }

  const searchItem = () => {
    setActive(true);
    let searchString = text;
    if(searchString){
      var filteredValue = batabases.filter((item) => item.toUpperCase().includes(searchString.toUpperCase()));
      if (filteredValue.length === 0) {
        filteredValue.push("No Record Exist");
      }
      setBataBases(filteredValue);
      setActive(false);
    }
    else{
      alert('Enter a keyword to search')
      setActive(false);

    }
   
  };
  const clearItem = () => {
    setText("");
    setBataBases(JSON.parse(atob(localStorage.getItem('batabaseAPI'))))
    //apiCall();
  };
  const handleInput = (e) => {
    setText(e.target.value);
  };
  const formatData = () => {
    let result = [];
    let level = { result };
    batabases.forEach((path) => {
      path.split("/").reduce((r, name, i, a) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({ name, path, children: r[name].result });
        }

        return r[name];
      }, level);
    });
    localStorage.setItem('formData',JSON.stringify(result))
    return result;
  };
  
  const changeView = () => {
    setSwitchView(!switchView)
  }
  
  const Tree = ({ data }) => {
    return (
      <div>
        <TreeNode node={data} />
      </div>
    );
  };

  const downloadFiles = (name) => {
    axios
      .get(`${process.env.REACT_APP_API_ROOT}/batabases/signURL?name=${name}`, {
        headers: {
          accept: "application/json",
          authorization: token,
        },
      })
      .then((res) => {
        window.open(res.data, "_blank");
      })
      .catch((err) => console.error(err));
  };

  // For recursive function call children
  const TreeNode = ({ node }) => {
    const isFileIncludes = imagesFormat.some(format => node.name.includes(format))
    const [isExpanded, setExpanded] = useState(false);
    const handleToggle = () => {
      setExpanded(!isExpanded);
    };
    return (
      <div>
        <div className="batabaseItem" onClick={handleToggle}>
        {switchView  ? node.children.length > 0 && (isExpanded ? "[-] " : "[+] "):''}
          {isFileIncludes ? (
            <Link
              style={{ textDecoration: "none", color: "black" }}
              className="download"
              onClick={() => downloadFiles(node.path)}
            >
              <div>{node.name}</div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-download"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                </svg>
              </div>
            </Link>
          ) : (
            <div className="parentName">{node.name}</div>
          )}
        </div>

        {switchView ? isExpanded && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((child,index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      ) : (<div style={{ marginLeft: "20px" }}>
          {node.children.map((child,index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>)}    
      </div>
    );
  };



  return (
    <div>
      <Header/>
      <div style={{marginTop: '100px'}}>
      {batabases ? 
      <>
      <div className="search">
        <input
          type="text"
          name="search"
          placeholder="Search"
          value={text}
          onChange={(e) => handleInput(e)}
          className="searchText"
          onKeyUp={(ev) => {
            if (ev.key === 'Enter') {
              // Do code here
              searchItem();
            }
          }}
        
        />
        <button
          className={isActive ? "disableButton" : "searchButton"}
          onClick={searchItem}
          type='submit'
        >
          Search
        </button>
        <button className="clearButton" onClick={clearItem}>
          Clear
        </button>
        <div>
        <Link to="/tbview" className='tableView'>
              Data Tracker Report
        </Link>
      </div>
      </div>
      <div className="container">
      <div className="switchButton"><Switch  defaultChecked onChange={changeView} />{switchView ? 'Collapse View' : 'Default View'}</div>
        {batabases && batabases.length > 0 ? (
          formatData().map((item, index) => {
            return <Tree data={item} />;
          })
        ) : (
          <div class="loader"></div>
        )}
      </div>
     
      </>
      :
      <div className='loader'></div>
      }
      <Footer/>
      </div>
    </div>
  )
}

export default DataLibrary
