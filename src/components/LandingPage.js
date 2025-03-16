import React, {createContext, useState} from "react";
import { Flag, Menu, MenuItem, MenuMenu, Segment, Input, Icon, GridRow, Grid, Dimmer, Loader} from "semantic-ui-react";
import { SearchUi } from "./dataviz/SearchUi";
import {GlobalRate} from "./dataviz/charts/GlobalRate";
import { Col, Container, Row } from "react-bootstrap";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";  
import { RateBar } from "./dataviz/charts/RateBar";
import { EvolutionChart } from "./dataviz/charts/EvolutionChart";
import { RateBarByDate } from './dataviz/charts/RateBarByDate'
export const DataContext = createContext({
    data: [],
    setData: (value) => {}
});

const LandingPage = () => {
    const [data, setData] = useState([]);
    const GET_DATA = gql`
  query GetViewHistoryEntriesAggregated {
  view_history_entries_aggregated {
    count
		is_replied
		date_trunc
		type
  }
}
`;
    const {
        loading: dataLoading,
        error: dataError,
        data: dataResult,
        refetch: refetchData,
      } = useQuery(GET_DATA, {
        suspend: true, 
      });
    if (dataLoading) return <div >
    <Row>
  <Container>
    <Menu attached='top' secondary color={"teal"} inverted>
    <MenuItem header style={{padding: "1% 3% 1% 3%", backgroundColor: "#099999"}}>Jarvi</MenuItem>
    <MenuMenu position='left'>
    <MenuItem>
        <Input icon='search' placeholder='Search...' iconPosition="left" style={{minWidth: "300px"}}/>
    </MenuItem>
    </MenuMenu>
    <MenuMenu position='right'>
        <MenuItem><div>
<Icon name="user" circular inverted color="grey" />
<span style={{paddingLeft: "10px", fontWeight: "bold"}}>Quentin</span>
</div></MenuItem>
        <MenuItem ><Flag name="gb"/></MenuItem>
        
  </MenuMenu>
    </Menu>
  </Container>

    </Row>
    <Row> 
      <div style={{height: "100px"}}>
      <Dimmer active>
        <Loader size='mini'>Loading</Loader>
      </Dimmer></div></Row></div>;
	  else if (dataError) return `Error! ${dataError.message}`;
    else{
      if( data.length === 0 ){
        setData({"project": "all", "viewMode": "global", "data": dataResult.view_history_entries_aggregated, "toCompare": []});
      }
    }
    return ( <DataContext.Provider value={{data, setData}}>
    <div >
        <Row>
      <Container>
        <Menu attached='top' secondary color={"teal"} inverted>
        <MenuItem header style={{padding: "1% 3% 1% 3%", backgroundColor: "#099999"}}>Jarvi</MenuItem>
        <MenuMenu position='left'>
        <MenuItem>
            <Input icon='search' placeholder='Search...' iconPosition="left" style={{minWidth: "300px"}}/>
        </MenuItem>
        </MenuMenu>
        <MenuMenu position='right'>
            <MenuItem><div>
    <Icon name="user" circular inverted color="grey" />
    <span style={{paddingLeft: "10px", fontWeight: "bold"}}>Quentin</span>
  </div></MenuItem>
            <MenuItem ><Flag name="gb"/></MenuItem>
            
      </MenuMenu>
        </Menu>
      </Container>

        </Row>
        <Row>
                <SearchUi />
                <Grid celled>
                <GridRow columns={2}> 
                 <GlobalRate />
                 <RateBar />
                 </GridRow>
                 { data.viewMode === "global" ?<GridRow columns={2}>
                  <RateBarByDate />
                  <EvolutionChart />
                 </GridRow> : <GridRow columns={1}>  <EvolutionChart /> </GridRow>}
                </Grid>
        
        </Row>
    </div></DataContext.Provider>);
}

export { LandingPage };