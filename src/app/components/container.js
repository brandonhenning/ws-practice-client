import React, { Component } from "react"
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'


class Container extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      bids: '',
      previousBids: '',
      asks: '',
      previousAsks: '',
      api: 'http://127.0.0.1:4545',
      flash: 'false' 
    }
  }

  async componentDidMount() {
    this.getPrice()
  }

  getPrice() {
    const self = this
    const ws = new WebSocket('ws://localhost:4545')
        ws.onopen = function (event) {
            console.log('websocket is connected ...', event)
        }
        ws.onmessage = function (event) {
            let webhookOrders = JSON.parse(event.data)
            let asks = webhookOrders.asks
            let bids = webhookOrders.bids
            self.setState({ 'asks': asks, 'flash': true, 'bids': bids })
        }
  }


  render() {
    const { bids, asks, flash } = this.state

    const theme = createMuiTheme({
      overrides: {
        MuiCardHeader: {
          action: {
            fontFamily: 'Roboto", "Roboto", "Roboto", "Roboto',
            fontSize: "1.5rem",
            fontWeight: 400,
            marginTop: 0,
            marginRight: 0,
            paddingRight: 50
          }
        }
      }
    })

    const orderBookStyle = {
      display: 'flex'
    }
    const bidsStyle = {
      flex: '0 0 50%'
    }
    const asksStyle = {
      flex: '0 0 50%'
    }

    return (
    <div id='orderbooks' style={orderBookStyle}>
      <div id='bids' style={bidsStyle}>
          <Card>
              <CardHeader
                  title="BIDS"
                />
          </Card>
        {bids
          ?
              bids.map(function(coin, index) {
                if (coin.exchanges == 'poloniex') {
                  coin.logo = 'https://www.5nej.cz/wp-content/uploads/2017/07/poloniex.png'
                } else if (coin.exchanges == 'bittrex') {
                  coin.logo = 'https://queenwiki.com/wp-content/uploads/2017/11/Bittrex.png'
                }
                let animation = ''
                if (flash) {
                  animation = 'flashgreen'
                } else {
                  animation = 'flashgreen'
                }
                return (
                  <Card className={animation} key={index}>
                    <MuiThemeProvider theme={theme}>
                    <CardHeader className={animation}
                      avatar={
                        <Avatar src={coin.logo} />
                      }
                      title={coin.exchanges}
                      subheader={coin.quantity}
                      action={coin.price}
                    />
                    </MuiThemeProvider>
                  </Card>
              )
              })
          :
            <Card>
                <CardHeader
                  title="Loading..."
                  subheader="Connecting to Websocket"
                />
            </Card>
            }
      </div>
      <div id='asks' style={asksStyle}>
        <Card>
              <CardHeader
                  title="ASKS"
              />
        </Card>
       {asks
          ?
              asks.map(function(coin, index) {
                if (coin.exchanges == 'poloniex') {
                  coin.logo = 'https://www.5nej.cz/wp-content/uploads/2017/07/poloniex.png'
                } else if (coin.exchanges == 'bittrex') {
                  coin.logo = 'https://queenwiki.com/wp-content/uploads/2017/11/Bittrex.png'
                }
                let animation = ''
                if (flash) {
                  animation = 'flashred' 
                } else {
                  animation = 'flashred'
                }
                return (
                  <Card className={animation} key={index}>
                    <MuiThemeProvider theme={theme}>
                    <CardHeader
                      avatar={
                        <Avatar src={coin.logo} />
                      }
                      title={coin.exchanges}
                      subheader={coin.quantity}
                      action={coin.price}
                    />
                    </MuiThemeProvider>
                  </Card>
              )
              })
          :
            <Card>
                <CardHeader
                  title="Loading..."
                  subheader="Connecting to Websocket"
                />
            </Card>
        }
      </div>
    </div>
    )
  }
}

export default Container
