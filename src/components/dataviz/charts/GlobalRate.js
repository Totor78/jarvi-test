import React, {useContext} from "react";
import { GridColumn, Segment, ButtonGroup, Button} from "semantic-ui-react";
import { Doughnut } from 'react-chartjs-2';  
import {DataContext} from "../../LandingPage";
import "chart.js/auto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const GlobalRate = () => {
  ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
    const {data, setData} = useContext(DataContext);
    const kpiResult = prepareData(data);
    const doughnutData = {
      labels: ['Responses', "No responses"],
      datasets: [
        {
          label: 'Responses details',
          data: [kpiResult[1], kpiResult[2]],
          datalabels: {
            anchor: 'center',
            backgroundColor: null,
            borderWidth: 0
          },
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderColor: [
            'rgb(255, 255, 255)',
            'rgb(255, 255, 255)',
          ],
          borderWidth: 5,
      }
      ],    
      };

    const options =  {
      maintainAspectRatio: true,
      responsive: true,
      aspectRatio: 1.8,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
        display: true,
        color: "white",
        align: "center",
        labels: {
          index: {
            align: 'end',
            anchor: 'end',
            color: function(ctx) {
              return ctx.dataset.backgroundColor;
            },
            font: {size: 18},
            formatter: function(value, ctx) {
              if(value !== 0) return (ctx.chart.data.labels[ctx.dataIndex] == "Responses" ? kpiResult[0].toFixed(2): (100 - kpiResult[0]).toFixed(2) ) + " % " 
              else return "";
            },
            offset: 8,
            
          },
          value: {
            align: 'bottom',
            backgroundColor: function(ctx) {
              var value = ctx.dataset.data[ctx.dataIndex];
              return value > 50 ? 'white' : null;
            },
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 4,
            color: function(ctx) {
              var value = ctx.dataset.data[ctx.dataIndex];
              return value > 50
                ? ctx.dataset.backgroundColor
                : 'white';
            },
            formatter: function(value, ctx) {
              return value
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
      <Segment padded color='blue' style={{margin: "50px 20px 50px 20px"}}>
      <Doughnut data={doughnutData} options={options} width={"100%"}/>
    
      </Segment>
      </GridColumn>
      
      );
}

const prepareData = (inputData) => {
      const initValue = 0;
      const counter = inputData.data.reduce((previous, {count}) => previous + count, initValue)
      const filteredData = inputData.data.filter((line) => line.is_replied === true)
      const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
      const kpi = (trueValues / counter ) * 100
      return [kpi, trueValues, counter - trueValues];
    
    
}

export { GlobalRate };