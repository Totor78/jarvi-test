import React, {useContext, useState, useCallback} from "react";
import { ButtonGroup, Button,
  HeaderContent, Header, Icon, 
  Segment, Dropdown} from "semantic-ui-react";
import { Col, Container, Row } from "react-bootstrap";
import {DataContext} from "../LandingPage.js"
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';


const SearchUi = () => {
    const {data, setData} = useContext(DataContext);
    const [selectedProject, setSelectedProject] = useState("ALL") 
    const [showPicker, setShowPicker] = useState(false);
    const [rangeData, setRangeData] = useState();
    const modifyData = useCallback((e, callbackData) => {
          
          if(callbackData.children == "Day"){
            const originalData = data.data;
            const toCompare = originalData.filter((element) => element.date_trunc == new Date().setDate(new Date().getDate() - 1));
            const tempData = originalData.filter((element) => element.date_trunc == new Date());
            setData({"viewMode": callbackData.children, "data": tempData, "project": selectedProject, "toCompare": toCompare});
          }
          else if(callbackData.children == "Month"){
            const monthString = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1);
            var formatMonth;
            var formatYear;
            if(new Date().getMonth() == 0){
              formatMonth = '12'
              formatYear = new Date().getFullYear() - 1
            }
            else if(new Date().getMonth()> 0 && new Date().getMonth() < 10 ){
              formatMonth = '0' + new Date().getMonth() 
              formatYear = new Date().getFullYear()
            }
            else{
              formatMonth = new Date().getMonth()
              formatYear = new Date().getFullYear()
            }
            
            const originalData = data.data;
            const toCompare = originalData.filter((element) => element.date_trunc.split("-")[0] == formatYear && element.date_trunc.split("-")[1] == formatMonth);
            const tempData = data.data.filter((element) => element.date_trunc.split("-")[0] == new Date().getFullYear() && element.date_trunc.split("-")[1] == monthString);
            setData({"viewMode": callbackData.children, "data": tempData, "project": selectedProject, "toCompare": toCompare});
          }
          else if(callbackData.children == "Year"){
            const date = new Date().setFullYear(new Date().getFullYear() -1);
            const toCompare = data.data.filter((element) => element.date_trunc.split("-")[0] == new Date(date).getFullYear());
            const tempData = data.data.filter((element) => element.date_trunc.split("-")[0] == new Date().getFullYear());
            setData({"viewMode": callbackData.children, "data": tempData, "project": selectedProject, "toCompare": toCompare});
          }
          else{
            setData({"viewMode": "global", "data": data.data, "project": selectedProject, "toCompare": data.toCompare})
          }
          
  }, []) 
    const options = [{
      key: "all",
      text: "ALL",
      value: "ALL"
    },...[...new Set(data.data.map(item => item.type))].map((value) => { 
      return {
      key: value.split("_")[1],
      text: value.split("_").length === 3 ? value.split("_")[value.split("_").length - 3 ] + " " +  value.split("_")[value.split("_").length - 2 ]: value.split("_")[value.split("_").length - 2 ] ,
      value: value,
    }})
  ];
    return (<Segment>
        <Row className="justify-content-md-center" style={{"paddingTop": "1%"}}>
            <Col md="auto">
            <div>
    <Header as='h3' icon textAlign='center'>
      <Icon name='chart bar' circular />
      <HeaderContent>Statistics</HeaderContent>
    </Header>
    <div>
    <ButtonGroup >
    <Button onClick={modifyData}>Day</Button>
    <Button onClick={modifyData}>Month</Button>
    <Button onClick={modifyData}>Year</Button>
    <Button onClick={modifyData}>All</Button>
    
    <Button icon="settings" onClick={() => setShowPicker(!showPicker)}/>
  </ButtonGroup>
  {showPicker ? <><SemanticDatepicker format='YYYY-MM-DD' onChange={(event, data) => setRangeData(data.value)}  type="range"/>
    <Button onClick={() => {
            if(rangeData.length == 1){
              const tempData = data.data.filter((element) => new Date(element.date_trunc) == rangeData[0]);
            setData({"viewMode": "range", "data": tempData, "project": selectedProject, "toCompare": []})
            }else{
            const tempData = data.data.filter((element) => (new Date(element.date_trunc) >= rangeData[0]) && (new Date(element.date_trunc) <= rangeData[1].setHours(23, 59, 59)));
            
            setData({"viewMode": "range", "data": tempData, "project": selectedProject, "toCompare": []})
            }
          }} icon="sync" color='green'/> </>
    
    : <></>}

    </div>
    <Dropdown
    search
    fluid
    selection
    wrapSelection={false}
    defaultValue={selectedProject}
    selectedLabel={selectedProject}
    onChange={(e, {value}) => {
      setSelectedProject(value)
      const tempData = (value == "ALL" ? data.data :data.data.filter((element) => element.type == value));
      setData({"viewMode": data.viewMode, "data": tempData, "project": selectedProject, "toCompare": data.toCompare})
      
    }}
    options={options}
  />
    
  </div>
            </Col>
          </Row>
    </Segment>);
}

export { SearchUi };