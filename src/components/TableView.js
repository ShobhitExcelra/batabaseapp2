import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addBatabase } from "../../src/utils/batabaseSlice";
import { useSelector } from "react-redux";
import useGetAccessToken from "./hooks/useGetAccessToken";

import Header from "./Header";
import Footer from "./Footer";

const columns = [
  "species_name",
  "Total Files",
  "TolID",
  "Subfolder Name",
  "assembly(draft)",
  "assembly(curated)",
  "assembly(mito)",
  "assembly(qc)",
  "assembly_vgp_HIC_2",
  "genomic_data(hic)",
  "genomic_data(hifi_reads)",
  "brain",
  "heart",
  "intestine",
  "kidney",
  "liver",
  "lung",
  "muscle",
  "ovaries",
  "spleen",
  "stomach",
  "testes",
];

const TableView = () => {
  let token = useGetAccessToken();

  let [data, setData] = useState([]);
  let [batabases, setBataBases] = useState([]);

  useEffect(() => {
    getbatabaseData();
  }, []);

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
        // dispatch(addBatabase({ batabaseAPI: response.data }));
        let result = parseResult(response.data);
        prepareData(result);
      })
      .catch((err) => console.error(err));
  };

  function parseResult(data) {
    let result = [];
    let level = { result };
    data.forEach((path) => {
      path.split("/").reduce((r, name, i, a) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({ name, path, children: r[name].result });
        }

        return r[name];
      }, level);
    });
    return result;
  }

  const options = {
    filterType: "checkbox",
  };

  function prepareData(data) {
    // Break the data in two parts in case of multiple TOLID

    data.map((newItem, index) => {
      if (newItem.children.length > 1) {
        data.splice(index, 1);
        for (var i = 0; i < newItem.children.length; i++) {
          let countValue = parseInt(i)+1;
          data[data.length] = {
            name: newItem.name + '('+countValue+')',
            path: newItem.path,
            children: [newItem.children[i]],
          };
        }
      }
    });

    let resultObj = {
      response: [],
      result: [],
      totalFiles: [],
      totalChildren: [],
      assemblyVgp: [],
      totalSubFolderFolder: [],
      assembly: [],
      genomicData: [],
    };
    let response = [];
    data.map((item, index) => {
      let totalChildrenData = findTotalChildrenName(item.children);
      resultObj.totalSubFolderFolder[item.name] =
        totalChildrenData["folderName"].join(" | ");
      resultObj.totalChildren[item.name] =
        totalChildrenData["childrenName"].join(" | ");
      resultObj.totalFiles[item.name] = countTotalFiles(item);
      response.push(traverse(item));
    });

    data.map((ritem, index) => {
      if (ritem.children[0].transcriptomic) {
        resultObj.result[ritem.name] = findSubFolderData(
          ritem.children[0].transcriptomic
        );
      }
      if (ritem.children[0].assembly_vgp_HiC) {
        let getAssemblyVGP = countLastChildren(
          ritem.children[0].assembly_vgp_HiC
        );
        resultObj.assemblyVgp[ritem.name] = getAssemblyVGP ? getAssemblyVGP : 0;
      }
      if (ritem.children[0].assembly) {
        resultObj.assembly[ritem.name] = findSubFolderData(
          ritem.children[0].assembly
        );
      }
      if (ritem.children[0].genomic_data) {
        resultObj.genomicData[ritem.name] = findSubFolderData(
          ritem.children[0].genomic_data
        );
      }
    });
    let responseData = createTableData(resultObj);

    setData(responseData);
  }
  function countLastChildren(node) {
    let count = 0;
    if (!node.children || node.children.length === 0) {
      // Check if it's a leaf node
      if (node.path && node.path.endsWith(".fasta.gz")) {
        count++;
      }
    } else {
      for (const childNode of node.children) {
        count += countLastChildren(childNode);
      }
    }
    return count;
  }
  function findTotalChildrenName(childrenData) {
    let childrenName = [];
    let folderName = [];
    let result = [];
    childrenData.map((item, index) => {
      item.children.map((childrenItem, index) => {
        folderName.push(childrenItem.name);
      });
      childrenName.push(item.name);
    });
    result["childrenName"] = childrenName;
    result["folderName"] = folderName;
    return result;
  }
  function countTotalFiles(node) {
    let count = 1;
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        count += countTotalFiles(child); // Recursive call
      });
    }

    return count;
  }

  function createTableData(resultObj) {
    let outputArray = [];
    // inputObject[row]["totalFiles"] = totalFiles[inputObject]

    for (const [key, value] of Object.entries(resultObj.assemblyVgp)) {
      if (!(key in resultObj.result)) {
        resultObj.result[key] = [];
      }
    }

    for (let key in resultObj.result) {
      let row = [key];
      if (!("brain" in resultObj.result[key])) {
        resultObj.result[row]["brain"] = 0;
      }
      if (!("heart" in resultObj.result[key])) {
        resultObj.result[row]["heart"] = 0;
      }
      if (!("intestine" in resultObj.result[key])) {
        resultObj.result[row]["intestine"] = 0;
      }

      if (!("kidney" in resultObj.result[key])) {
        resultObj.result[row]["kidney"] = 0;
      }
      if (!("liver" in resultObj.result[key])) {
        resultObj.result[row]["liver"] = 0;
      }
      if (!("lung" in resultObj.result[key])) {
        resultObj.result[row]["lung"] = 0;
      }
      if (!("muscle" in resultObj.result[key])) {
        resultObj.result[row]["muscle"] = 0;
      }
      if (!("ovaries" in resultObj.result[key])) {
        resultObj.result[row]["ovaries"] = 0;
      }
      if (!("spleen" in resultObj.result[key])) {
        resultObj.result[row]["spleen"] = 0;
      }
      if (!("stomach" in resultObj.result[key])) {
        resultObj.result[row]["stomach"] = 0;
      }
      if (!("testes" in resultObj.result[key])) {
        resultObj.result[row]["testes"] = 0;
      }

      let entries = Object.entries(resultObj.result[key]);
      // Sort the array based on keys
      entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

      let sortedObject = Object.fromEntries(entries);

      let values = Object.values(sortedObject);

      for (let value of values) {
        row.push(value);
      }

      outputArray.push(row);
    }

    outputArray.map((item) => {
      let itemName = item[0];
      let totalvalues = resultObj.totalFiles[itemName];
      let toLIID = resultObj.totalChildren[itemName];
      let subFolderName = resultObj.totalSubFolderFolder[itemName];
      let assemblyVgpVal = resultObj.assemblyVgp[itemName]
        ? resultObj.assemblyVgp[itemName]
        : 0;

      let assemblyDraft =
        resultObj.assembly[itemName] && resultObj.assembly[itemName]["draft"]
          ? resultObj.assembly[itemName]["draft"]
          : 0;
      let assembly_curated =
        resultObj.assembly[itemName] && resultObj.assembly[itemName]["curated"]
          ? resultObj.assembly[itemName]["curated"]
          : 0;
      let assemblyMito =
        resultObj.assembly[itemName] && resultObj.assembly[itemName]["mito"]
          ? resultObj.assembly[itemName]["mito"]
          : 0;
      let assemblyQC =
        resultObj.assembly[itemName] && resultObj.assembly[itemName]["qc"]
          ? resultObj.assembly[itemName]["qc"]
          : 0;

      let genomic_data_hic =
        resultObj.genomicData[itemName] &&
        resultObj.genomicData[itemName]["hic"]
          ? resultObj.genomicData[itemName]["hic"]
          : 0;
      let genomic_data_hifi_reads =
        resultObj.genomicData[itemName] &&
        resultObj.genomicData[itemName]["hifi_reads"]
          ? resultObj.genomicData[itemName]["hifi_reads"]
          : 0;

      item.splice(1, 0, totalvalues);
      item.splice(2, 0, toLIID);
      item.splice(3, 0, subFolderName);

      item.splice(4, 0, assemblyDraft);
      item.splice(5, 0, assembly_curated);
      item.splice(6, 0, assemblyMito);
      item.splice(7, 0, assemblyQC);

      item.splice(8, 0, assemblyVgpVal);
      item.splice(9, 0, genomic_data_hic);
      item.splice(10, 0, genomic_data_hifi_reads);
    });
    return outputArray;
  }

  function countFastqFiles(jsonArray) {
    let count = 0;

    function findFiles(node) {
      if (
        node.children.length === 0 &&
        node.path &&
        node.path.endsWith(".gz")
      ) {
        count++;
      } else {
        node.children.forEach((child) => findFiles(child));
      }
    }

    findFiles(jsonArray);
    return count;
  }

  function findSubFolderData(tData) {
    let result = [];
    tData.children.map((item, index) => {
      result[item.name] = countFastqFiles(item);
    });
    return result;
  }

  function traverse(data) {
    if (data.children && data.children.length > 0) {
      data.children.forEach((child) => {
        if (child.name === "transcriptomic_data") {
          data.transcriptomic = child;
        }
        if (child.name === "assembly_vgp_HiC_2.0") {
          data.assembly_vgp_HiC = child;
        }
        if (child.name === "assembly_curated") {
          data.assembly_curated = child;
        }
        if (child.name === "assembly") {
          data.assembly = child;
        }
        if (child.name === "genomic_data") {
          data.genomic_data = child;
        }

        traverse(child);
      });
    }
    return data;
  }

  return (
    <div>
      <Header />
      <div className="container" style={{ paddingTop: "100px" }}>
        <MUIDataTable
          title={"Reports"}
          data={data}
          columns={columns}
          options={{
            selectableRows: false, // <===== will turn off checkboxes in rows
            rowsPerPage: 10,
            draggableColumns: {
              enabled: true,
            },
            responsive: "standard",
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default TableView;
