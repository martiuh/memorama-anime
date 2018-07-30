import React, { Fragment } from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import gon from '../cards/gon.jpg'
import naruto from '../cards/naruto.jpg'
import killua from '../cards/killua.jpg'
import guts from '../cards/guts.jpg'
import saitama from '../cards/saitama.jpg'
import back from '../images/back.jpg'

import './index.css'

const mockArr = [gon, naruto, killua, guts, saitama]

// Tomada de esta respuesta en stackoverflow https://stackoverflow.com/a/12646864/4879756
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
  return array
}

const uniqueID = () => `${Math.random().toString(32).substr(3)}`

const memoramaShuffle = () => shuffleArray([...mockArr, ...mockArr]).map(G => ({ name: G, src: G, id: uniqueID(), found: false }))

class App extends React.Component {
  state = {
    gamemode: 'regular',
    gamemodes: ['regular', 'tries'],
    gamewon: false,
    cards: memoramaShuffle(),
    from: { id: null, name: null },
    to: null
  }

  select = ({ id, name }) => {
    const { from, cards } = this.state
    if (!from.id) { // Inicia la primera selección
      return this.setState({ from: { id, name } })
    }
    else {
      console.log(name);
      if (from.name === name) {
        this.setState(prev => ({
          cards: cards.map(C => {
            if (C.name === name) {
              C.found = true
            }
            return C
          })
        }))
      }
      // Corro la animación para que se vea que se hizo el par y se bloqueé
      return this.setState({ to: id }, () => {
        const { cards } = this.state
        let timer = 400
        let newState = {
          ...this.state,
          from: {
            id: null,
            name: null
          },
          to: null
        }

        if (cards.filter(({ found}) => !found).length === 0) {
          newState.gamewon = true
          timer = 0;
        }
        setTimeout(() => {
        this.setState(newState)
      }, timer)
      })
    }
  }

  render () {
    const { cards, from, to, gamewon } = this.state
    return (
      <Fragment>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {gamewon ? (
            <div className='modal'>
              <button
                onClick={() => {
                  this.setState(prev => ({
                    cards: prev.cards.map(C => {
                      C.found = false
                      return C
                    }),
                    gamewon: false
                  }), () => setTimeout(() => {
                    this.setState({ cards:  memoramaShuffle() })
                  }, 300))
                }}
              >
                Reiniciar
              </button>
            </div>
          ) : null}
          <h1>Memorama</h1>
          <div className='memorama'>
            {cards.map(({ name, id, found, src }) => (
              <div
                disabled={id === from.id || to === id || found}
                onClick={() => this.select({ id, name })}
                className={`card ${id === from.id || to === id || found ? 'selected' : ''}`}
                key={id}>
                <div className='flipper'>
                  <div className='front'>
                    <img
                      alt={name}
                      src={name}
                      />
                  </div>
                  <div className='back'>
                    <img
                      alt={back}
                      src={back}
                      />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }
}

const IndexPage = () => (
  <Layout>
    <App />
  </Layout>
)

export default IndexPage
