import React from 'react'
import './App.css';
import Chart from 'react-apexcharts'

const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
const stonksUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/GME?region=US&lang=en-US&includePrePost=false&interval=15m&range=5d&corsDomain=search.yahoo.com`
const getStonks = async()=>{
  const response = await fetch(stonksUrl)
  return response.json()
}

const chart  ={
          
  series: [{
    data: [{
        x: new Date(1538778600000),
        y: [6629.81, 6650.5, 6623.04, 6633.33]
      },
    ]
  }],
  options: {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  },


};
function App() { 
  const [price, setPrice] = React.useState(0)
  const [priceTime, setPriceTime] = React.useState(null)
  const [prePrice, setPrePrice] = React.useState(0)
  const [series, setSeries] = React.useState([{
    data: []
  }]);

  React.useEffect(() => {
    let timeoutId
      const getLatestPrice= async()=>{
        try {
        const data = await getStonks()
        const meta = data.chart.result[0].meta
        setPrePrice(price)
        setPrice(meta.regularMarketPrice)
        const quote = data.chart.result[0].indicators.quote[0]
        const candles = data.chart.result[0].timestamp.map((timestamp, index)=>  ({
          x : new Date(timestamp * 1000),
          y : [quote.open[index], quote.high[index], quote.low[index], quote.close[index]].map((price)=> price.toFixed(2))
        }))
        setPriceTime(new Date(meta.regularMarketTime * 1000))
        setSeries([{
          data: candles
        }],)}
        catch (error) {
      console.log(error)
      } 
        timeoutId = setTimeout(getLatestPrice, 5000) 
      }  
      getLatestPrice() 
    
    
    return ()=>{
      clearTimeout(timeoutId)
    }
    
  },[])
  const direction = React.useMemo(()=>{
    return  price > prePrice ? 'up' : price < prePrice ? 'down' : "" ;
  },[price, prePrice])
  
  return (
    <div>
      <div className='warning'>
        DO NOT EVER INVEST IN STOCKS BASED ON WHAT YOU SEE HERE HAHAHA
      </div>
      <div className={['price', direction].join(' ')}>
        ${price}
      </div>
      <div className='time'>
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <div id="chart">
        <Chart options={chart.options} series={series} type="candlestick" height={350} />
      </div>
  </div>
    
  );
}

export default App;
