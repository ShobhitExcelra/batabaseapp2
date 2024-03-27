import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import humanList from '../data/humanList'
import inputfile from '../data/inputfile'
export default function SearchProtein() {
  let [searchData,setSearchData] = useState('')
  let [humanDataProtein,setHumanData] = useState([]);
  let [publicData,setpublicData] = useState([]);
  const optionData = humanList.map(obj => Object.keys(obj)[0]);
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={optionData}
      getOptionLabel={(option) => option}
      sx={{ width: 300 }}
      onChange={(event,value)=>{
        console.log(value,'VAL')
        if(value){
          let hpValue = humanList.map(obj => obj[value]).find(val => val !== undefined);
        let filterItem = inputfile[hpValue].filter((item)=> !item.includes(value));
        let humanData = inputfile[hpValue].filter((item)=> item.includes(value));
        let humanDataSplit = humanData[0].split('...');
        let humPerIdentity = humanData[0].split(" at ");
        let humaneGene = humanDataSplit[0].split('|');
        let humanProteinName = [];
        humanProteinName['name'] = humanDataSplit[0];
        humanProteinName['pIdentity'] = humPerIdentity[1];
        humanProteinName['gene'] = humaneGene[2];
        humanProteinName['id'] = humaneGene[1];
        setHumanData(humanProteinName)
        

        let publicBatSpecies = filterItem.map((item)=>{
          const regex = /non_bat/;
          let result = {}
          let batName = item.split(".");
          let type = batName[0].includes("Public") ? "Public" : "Paratus";
          if(type === "Public"){
            let spiltString = item.split("|");
          let parts = spiltString[2].split("_");
          let proteinName = parts[1].split(" at ");
          let pname = proteinName[0].split(".")
          result['bat'] = batName[0];
          result['type'] = type;
          result['gene'] = pname[0];
          result['id'] = parts[0];
          result['pIdentity'] = proteinName[1];
          if (regex.test(item)) {
              let searchTerm = "mammalian";
              let index = spiltString[0].indexOf(searchTerm);
              let batString = spiltString[0].substring(index + searchTerm.length);
              // Remove underscores and split the string into an array of words
              let nonBatStr = batString.split('_').filter(word => word.length > 0);
              result['species'] = nonBatStr.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");;
              } else {
                  const match = spiltString[0].match(/Public_(.*?)_tr/);
                  if(match){
                    const wordBetweenPublicAndTr = match[1].split("_");
                    result['species'] = wordBetweenPublicAndTr.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");;
                  }
              }
          }
          else{
            let privatebatSplit = item.split("...");
            let batSpeciesName = privatebatSplit[0].split('.')[1].split('_');
            let geneSpeciesSplit = privatebatSplit[0].split('_');
            let perecentageIdentityStr = item.split(" at ");
            result['bat'] = privatebatSplit[0];
            result['type'] = type;
            result['species'] = batSpeciesName[0]+" "+batSpeciesName[1];
            result['gene'] = geneSpeciesSplit[2];
            result['id'] = '';
            result['pIdentity'] = perecentageIdentityStr[1];
          }
          return result;

        })        
       setpublicData(publicBatSpecies);
      }}
        }
        
      renderInput={(params) => <><div className='searchHumanProtein'><TextField {...params} label="Human Protein" /></div>
        {
          humanDataProtein.name ? 
         <div className='humanData'>
         <table>
                  <h4>Human Data</h4>

            
          <tr>
            <th>Human</th>
            <th>Gene</th>
            <th>ID</th>
            <th>Percentage Identity</th>
          </tr>
          <tr>
            <td>{humanDataProtein.name}</td>
            <th>{humanDataProtein.gene}</th>
            <th>{humanDataProtein.id}</th>
            <th>{humanDataProtein.pIdentity}</th>
          </tr>
         
    
  </table></div>: ''
        } 
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {
          publicData.length > 0 ? 
          <div className='publicData'>
          <table>
                      <h4>Bat Data</h4>

          <tr>
            <th>Bat</th>
            <th>Type</th>
            <th>Species</th>
            <th>Gene</th>
            <th>ID</th>
            <th>Percentage Identity</th>
          </tr>
          {
            publicData.map((item)=>{
              return(
                <>
                 <tr>
              <td>{item['bat']}</td>
              <th>{item.type}</th>
              <th>{item.species}</th>
              <th>{item.gene}</th>
              <th>{item.id}</th>
              <th>{item.pIdentity}</th>
            </tr>
                </>
              )
             
           
            })
          }
         
    
  </table></div> : ''
        } 
</>
    }
    />
  );
}

