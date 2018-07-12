import React, { Component } from "react";
import socketIOClient from 'socket.io-client';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


class Container extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      coins: '',
      previousCoins: '',
      api: 'http://127.0.0.1:5000' //TODO move to config
    };
  }

  async componentDidMount() {
    const response = await fetch(this.state.api);
    const body = await response;

    if (response.status !== 200)
      throw Error(body.message); //TODO Fail gracefully in the UI

    this.getPrice();
  }

  getPrice() {
    const socket = socketIOClient(this.state.api);
    socket.on('getPrices', data => {
      this.setState({ 'coins': data, 'previousCoins': this.state.coins })
    });
  }

  render() {
    const { coins, previousCoins } = this.state;

    const theme = createMuiTheme({
      overrides: {
        MuiCardHeader: {
          action: {
            fontFamily: 'Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "2rem",
            fontWeight: 400,
            marginTop: 0,
            marginRight: 0
          }
        }
      }
    });

    return (
      <div>
      <Card>
        {coins ? '' : <LinearProgress /> }
        <CardHeader
          title="Cryptocurrency Dastboard"
          subheader="Realtime price updates of Bitcoin, Etheruem, and Litecoin."
        />
      </Card>
        {coins
          ?
              coins.map(function(coin, index) {
                let animation = '';
                if (previousCoins) {
                  animation = coin.price > previousCoins[index].price ? 'flashgreen' : 'flashred';
                } else {
                  animation = 'flashgreen';
                }
                return (
                  <Card className={animation} key={index}>
                    <MuiThemeProvider theme={theme}>
                    <CardHeader
                      avatar={
                        <Avatar src={coin.logo} />
                      }
                      title={coin.name}
                      subheader={coin.symbol}
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
                  subheader="Reticulating splines"
                />
            </Card>
            }
      </div>
    );
  }
}

export default Container;
