import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts'
import moment from 'moment'

class App extends Component {
  constructor() {
    super()
    this.state = {
      events: [],
      newEvents: [],
      data: [],
    }
  }

  componentDidMount = () => {
    const socket = socketIOClient('localhost:4000')
    socket.on('new-message', event => {
      this.setState({
        events: [...this.state.events, { text: event.text, createdAt: event.created_at }],
        newEvents: [...this.state.newEvents, event]
      })
    })
    setInterval(() => {
      this.setState({ data: [...this.state.data, { time: moment().format('HH:mm:ss DD-MM-YYYY'), count: this.state.newEvents.length }], newEvents: [] })
    }, 60000)
  }

  render() {
    const { data, events } = this.state
    return (
      <div>
        <h1 style={{ textAlign: 'center', fontSize: '50px' }}>Trade War</h1>
        <div style={{ margin: 'auto', width: '1300px' }}>
          <LineChart width={1200} height={400} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
        <div style={{ height: '500px', overflow: 'scroll' }}>
          {
            events.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 50 }} >
                {i + 1} : {moment(data.createdAt).format('HH:mm:ss DD-MM-YYYY')} {data.text}
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App
