import React, {useContext} from "react";
import { GridColumn, Icon, Segment, ButtonGroup, Button} from "semantic-ui-react";
import { Bar } from 'react-chartjs-2';  
import {DataContext} from "../../LandingPage";
import "chart.js/auto";
import { Chart as ChartJS, CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const RateBar = () => {
  ChartJS.register(CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend, ChartDataLabels);
    const {data, setData} = useContext(DataContext);
    const kpiResult = prepareData(data);
    const barData = {
      labels: [...new Set(kpiResult.map(item => item.type))],
      datasets: [
        {
          data: [...new Set(kpiResult.filter((value) => value.typeData == "current").map((item) => item.kpi))],
          backgroundColor: "green"
        }
      ]

    
      };
    const options =  {
      maintainAspectRatio: true,
      responsive: true,
      aspectRatio: 1.8,
      scales: {
        y: {
            suggestedMin: 0,
            suggestedMax: 100
        },
        x: {
            suggestedMin: 0,
            suggestedMax: 100
        }
    },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
        display: true,
        color: "white",
        align: "center",
        labels: {
          index: {
            align: 'end',
            anchor: 'end',
            color: 'black',
            font: {size: 18},
            formatter: function(value, context) {

                var i = context.dataIndex;
                var type = context.chart.data.labels[context.dataIndex]; 
                var prev = kpiResult.filter((value) => value.type == type && value.typeData == "last");
                if(prev.length == 0){
                    return ""
                }
                else{
                var prevValue = prev[0].kpi;
                var diff = prevValue !== undefined ? prevValue - value : 0;
                var glyph = diff < 0 ? '+' : diff > 0 ? '-' : '=';
                return glyph + ' ' + (prevValue === undefined ? Math.round(value) :Math.round(Math.abs(prevValue - value))) + "%";
                }
            },
            offset: 8,
            
          },
          value: {
            align: 'bottom',
            backgroundColor: "white",
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 4,
            color: function(ctx) {
              return  ctx.dataset.backgroundColor;
            },
            formatter: function(value, ctx) {
              return value.toFixed(1) + " %"
            },
            padding: 4
          }
        }
        
        }
  }
      
    };
    


        

            
    return (
      
      <GridColumn >
        <ButtonGroup basic size='small' floated='right' >
          <Button icon='eye' />
          <Button icon='settings' />
          <Button icon='download' />
        </ButtonGroup>
      <Segment padded color='olive' style={{margin: "50px 20px 50px 20px"}}>
      <Bar data={barData} options={options} width={"100%"}/>
    
      </Segment>
      </GridColumn>
      
      );
}

const prepareData = (inputData) => {
    

    const mappedData = Object.groupBy(inputData.data, ({ type }) => type );
    const resultArr = []; 
    Object.values(mappedData).forEach(element => {
        const initValue = 0;
        const counter = element.reduce((previous, {count}) => previous + count, initValue)
        const filteredData = element.filter((line) => line.is_replied === true)
        const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
        const kpi = (trueValues / counter ) * 100
        const type = [...new Set(element.map(item => item.type))];
        resultArr.push({"type": type[0], "kpi": kpi, "typeData": "current"});

    });
    
    const mappedCompareData = Object.groupBy(inputData.toCompare, ({ type }) => type );
    Object.values(mappedCompareData).forEach(element => {
        const initValue = 0;
        const counter = element.reduce((previous, {count}) => previous + count, initValue)
        const filteredData = element.filter((line) => line.is_replied === true)
        const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
        const kpi = (trueValues / counter ) * 100
        const type = [...new Set(element.map(item => item.type))];
        resultArr.push({"type": type[0], "kpi": kpi, "typeData": "last"});

    });
    
    return resultArr;
}

export { RateBar };