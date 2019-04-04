import React, { Component } from 'react';
import './App.css';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import formatNumber from 'accounting-js/lib/formatNumber.js'
import * as math from 'mathjs'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  euro = (val) => formatNumber(parseFloat(val), { precision: 2, thousand: ".", decimal: ",", stripZeros: true })

  sliderRow = (row, key) => {
    const name = row.toLowerCase().replace(/\s/g, '').slice(0, 8)
    console.log(name)
    let value = this.state[name]

    let min = 0, max = 1000, step = 10
    switch (name) {
      case "aanschaf":
        {
          min = 1000
          max = 100000
          step = 500
          break;
        }
      case "gebruiks":
        {
          min = 1
          max = 20
          step = 1
          break;
        }
      case "restwaar":
        {
          min = 0
          max = 50000
          step = 500
          break;
        }
      case "aantalkm":
        {
          min = 1000
          max = 50000
          step = 1000
          break;
        }
      case "kmperlit":
        {
          min = 5
          max = 25
          step = 1
          break;
        }
      case "prijsper":
        {
          min = 1
          max = 2
          step = 0.05
          value = parseFloat((value || min).toFixed(2))
          break;
        }
      case "motorrij":
        {
          min = 250
          max = 2500
          step = 250
          break;
        }
      case "verzeker":
      case "onderhou":
        {
          min = 200
          max = 2000
          step = 100
          break;
        }
      case "overig":
        {
          min = 50
          max = 500
          step = 50
          break;
        }
      case "renteper":
        {
          min = 0
          max = 5
          step = 0.5
          break;
        }
      default:
        break;
    }

    return <div key={key} className="newLifeCon">
      <div className="col-12">
        <div className='value'>
          <div className="col-3 text-right">{`${row}: ${["prijsper", "renteper"].includes(name) ? (value || min) : this.euro(value || min)}`}</div>
        </div>
      </div>
      <div className="col-12">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value || min}
          orientation='horizontal'
          onChange={(val) => this.setState({ [name]: val })}
        />
      </div>
    </div>
  }
  render() {
    const div1 = ["Aanschafprijs", "Gebruiksduuur", "Restwaarde"]
    const div2 = ["Aantal KM per jaar", "KM per liter", "Prijs per liter"]
    const div3 = ["Motorrijtuigenbelasting", "Verzekering", "Onderhoud", "Overig"]
    const div4 = ["Rente percentage"]

    const { aanschaf = 1000, gebruiks = 1, restwaar = 0, aantalkm = 1000, kmperlit = 5, prijsper = 1, motorrij = 250, verzeker = 200, onderhou = 200, overig = 50, renteper = 0 } = this.state

    const afschrijving = math.chain(aanschaf).subtract(restwaar).divide(gebruiks)
    const brandstofkosten = math.chain(aantalkm).divide(kmperlit).multiply(prijsper)
    const rentekosten = math.chain(aanschaf).multiply(renteper)

    const kostenjaar = math.add(parseFloat(afschrijving), parseFloat(brandstofkosten), motorrij, verzeker, onderhou, overig, parseFloat(rentekosten))
    const kostenmaand = math.divide(parseFloat(kostenjaar), 12)

    return (
      <div className="content-border" >
        <div className="border-bottom-1  fix-small-dev">
          <div className="container">
            <span className="lh-40"><strong>Auto Car Calculator</strong></span>
          </div>
        </div>
        <div className="mainContentCon">
          <div className="contentCon overflow">
            <div>Per Jaar<p>{`${this.euro(kostenjaar)} Euro`}</p></div>
            <div>Per Maand<p>{`${this.euro(kostenmaand)} Euro`}</p></div>
            <hr />
            <div>
              {div1.map((row, i) => this.sliderRow(row, i))}
              <div className="col-12">
                <div className='value'>
                  <div className="col-3 text-right">{`Afschrijving  ${this.euro(afschrijving)}`}</div>
                </div>
              </div>
            </div>
            <div>
              {div2.map((row, i) => this.sliderRow(row, i))}
              <div className="col-12">
                <div className='value'>
                  <div className="col-3 text-right">{`Brandstof kosten:  ${this.euro(brandstofkosten)}`}</div>
                </div>
              </div>
            </div>
            <div>{div3.map((row, i) => this.sliderRow(row, i))}</div>
            <div>
              {div4.map((row, i) => this.sliderRow(row, i))}
              <div className="col-12">
                <div className='value'>
                  <div className="col-3 text-right">{`Rente kosten:  ${this.euro(rentekosten)}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
