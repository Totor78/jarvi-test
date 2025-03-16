import React, {useContext} from "react";
import { GridColumn, Segment, ButtonGroup, Button} from "semantic-ui-react";
import { Bar } from 'react-chartjs-2';  
import {DataContext} from "../../LandingPage";
import "chart.js/auto";
import { Chart as ChartJS, CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const RateBarByDate = () => {
    ChartJS.register(CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend, ChartDataLabels);
        const {data, setData} = useContext(DataContext);
        const backgroundColors = ['rgb(53, 162, 235)', 'rgb(235, 53, 53)', 'rgb(53, 235, 74)']
        const kpiResult = prepareData(data);
        const group = Object.groupBy(kpiResult, ({date}) => date);
        const chartData = Object.values(group).map((value, index) => { 
            const dataNumber = [];
            value.forEach((element) => {
                dataNumber.push(element.kpi)
            })
            return {
            label: value[0].date,
            data: dataNumber,
            backgroundColor: backgroundColors[index]
          }});
        const barData = {
          labels: [...new Set(kpiResult.map(item => item.type))],
          datasets: chartData
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
              display: true,
            },
            datalabels: {
            display: true,
            color: "white",
            align: "center",
            labels: {
              title: {
                font: {
                  weight: "bold",
                },
              },
              value: {
                color: "white",
              },
            },
            formatter: function (value) {
              return "\n" + value.toFixed(1) + " %";
            },
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
                  <Segment padded color='red' style={{margin: "50px 20px 50px 20px"}}>
          <Bar data={barData} options={options} width={"100%"}/>
        
          </Segment>
          </GridColumn> 
          
          );
    }
    
    const prepareData = (inputData) => {
      if(inputData.viewMode === 'global'){
        const mappedData = Object.groupBy(inputData.data, ({ type }) => type );
        const resultArr = []; 
        Object.values(mappedData).forEach(element => {
            const groupedData = Object.groupBy(element, ({ date_trunc }) => date_trunc.split("-")[0] );
            Object.values(groupedData).forEach(groupedElement => {
                const initValue = 0;
                const counter = groupedElement.reduce((previous, {count}) => previous + count, initValue)
                const filteredData = groupedElement.filter((line) => line.is_replied === true)
                const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
                const kpi = (trueValues / counter ) * 100
                const type = [...new Set(groupedElement.map(item => item.type))];
                const date = [...new Set(groupedElement.map(item => item.date_trunc))];
                resultArr.push({"type": type[0], "kpi": kpi, "date": date[0].split("-")[0]});
            });
        });
        
        return resultArr;
      }
      else{
      
      return [];
      }
    }

export { RateBarByDate };