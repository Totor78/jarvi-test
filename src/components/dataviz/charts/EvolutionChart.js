import React, {useContext} from "react";
import { GridColumn, Segment, ButtonGroup, Button} from "semantic-ui-react";
import { Line } from 'react-chartjs-2';  
import {DataContext} from "../../LandingPage";
import "chart.js/auto";
import { Chart as ChartJS, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,} from 'chart.js';


const EvolutionChart = () => {
    ChartJS.register(CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend);
        const {data, setData} = useContext(DataContext);
        const backgroundColors = ['rgb(53, 162, 235)', 'rgb(235, 53, 53)', 'rgb(53, 235, 74)']
        const pointColors = ['rgb(167, 210, 239)', 'rgb(237, 156, 156)', 'rgb(176, 235, 183)']
        const kpiResult = prepareData(data);
        const group = Object.groupBy(kpiResult, ({type}) => type);
        const allLabelDate = [...new Set(kpiResult.map(item => item.date))]
        const chartData = Object.values(group).map((value, index) => { 
            const dataNumber = [];
            value.forEach((element) => {
                dataNumber.push(element.kpi)
            })
            if(dataNumber.length < allLabelDate.length){
                dataNumber.push(0)
            }
            return {
            label: value[0].type,
            data: dataNumber,
            backgroundColor: backgroundColors[index],
            borderColor: pointColors[index]
          }});
        const barData = {
          labels: [...new Set(kpiResult.map(item => item.date))].sort(function(a,b){
            return new Date(a) - new Date(b);
          }),
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
            color: function(context) {
                var i = context.dataIndex;
                var value = context.dataset.data[i];
                var prev = context.dataset.data[i - 1];
                var diff = prev !== undefined ? value - prev : 0;
                return diff < 0 ? "red" :
                  diff > 0 ? "green" :
                  'gray';
              },
              align: function(context) {
                var index = context.dataIndex;
                var curr = context.dataset.data[index];
                var prev = context.dataset.data[index - 1];
                var next = context.dataset.data[index + 1];
                return prev < curr && next < curr ? 'top' :
                  prev > curr && next > curr ? 'bottom' :
                  'top';
              },
              formatter: function(value, context) {
                var i = context.dataIndex;
                var prev = context.dataset.data[i - 1];
                var diff = prev !== undefined ? prev - value : 0;
                var glyph = diff < 0 ? '▲' : diff > 0 ? '▼' : '◆';
                return glyph + ' ' + (prev === undefined ? Math.round(value) :Math.round(Math.abs(prev - value)));
              },
              padding: 5,
              offset: 8,
            labels: {
              title: {
                font: {
                  weight: "bold",
                  size: "8px"
                },
              },
              
            },
            
            },
      }
          
        };
                
        return (
          
          <GridColumn >
            <ButtonGroup basic size='small' floated='right' >
                      <Button icon='eye' />
                      <Button icon='settings' />
                      <Button icon='download' />
                    </ButtonGroup>
                  <Segment padded color='orange' style={{margin: "50px 20px 50px 20px"}}>
          <Line data={barData} options={options} width={"100%"}/>
        
          </Segment>
          </GridColumn>
          
          );
    }
    
    const prepareData = (inputData) => {
        const mappedData = Object.groupBy(inputData.data, ({ type }) => type );
        const resultArr = []; 
      if(inputData.viewMode == 'global' || inputData.viewMode == 'month'){
        Object.values(mappedData).forEach(element => {
            const groupedData = Object.groupBy(element, ({ date_trunc }) => date_trunc.split("-")[0] + date_trunc.split("-")[1] );
            Object.values(groupedData).forEach(groupedElement => {
                const initValue = 0;
                const counter = groupedElement.reduce((previous, {count}) => previous + count, initValue)
                const filteredData = groupedElement.filter((line) => line.is_replied === true)
                const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
                const kpi = (trueValues / counter ) * 100
                const type = [...new Set(groupedElement.map(item => item.type))];
                const date = [...new Set(groupedElement.map(item => item.date_trunc))];
                resultArr.push({"type": type[0], "kpi": kpi, "date": date[0].split("-")[0] + '-' +date[0].split('-')[1]});
            });
        });
        
      }
      else if(inputData.viewMode == 'year'){
        Object.values(mappedData).forEach(element => {
            const groupedData = Object.groupBy(element, ({ date_trunc }) => date_trunc.split("-")[0]  );
            Object.values(groupedData).forEach(groupedElement => {
                const initValue = 0;
                const counter = groupedElement.reduce((previous, {count}) => previous + count, initValue)
                const filteredData = groupedElement.filter((line) => line.is_replied === true)
                const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
                const kpi = (trueValues / counter ) * 100
                const type = [...new Set(groupedElement.map(item => item.type))];
                const date = [...new Set(groupedElement.map(item => item.date_trunc))];
                resultArr.push({"type": type[0], "kpi": kpi, "date": date[0].split("-")[0] });
            });
        });
      }
      else{
        Object.values(mappedData).forEach(element => {
            const groupedData = Object.groupBy(element, ({ date_trunc }) => date_trunc);
            Object.values(groupedData).forEach(groupedElement => {
                const initValue = 0;
                const counter = groupedElement.reduce((previous, {count}) => previous + count, initValue)
                const filteredData = groupedElement.filter((line) => line.is_replied === true)
                const trueValues = filteredData.reduce((previous, {count}) => previous + count, 0)
                const kpi = (trueValues / counter ) * 100
                const type = [...new Set(groupedElement.map(item => item.type))];
                const date = [...new Set(groupedElement.map(item => item.date_trunc))];
                resultArr.push({"type": type[0], "kpi": kpi, "date": date[0]});
            });
        });
      }
      return resultArr;
    }

export { EvolutionChart };