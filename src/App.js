import "./App.scss"
import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const [ticketList, setTicketList] = useState([])
  const [fullTicketsList, setFullTicketsList] = useState([])

  const ROOT_URL = "https://front-test.beta.aviasales.ru"

  const SEARCH_ID_URL = generateUrl("search")
  const TICKETS_URL = generateUrl("tickets")

  function generateUrl(path) {
    return [ROOT_URL, path].join("/")
  }

  async function getSearchId() {
    console.log("Getting search ID:", SEARCH_ID_URL)

    const {
      data: { searchId },
    } = await axios.get(SEARCH_ID_URL)

    console.log("Got search ID:", searchId)

    return searchId
  }

  async function getTickets(searchId) {
    const ticketsUrl = [TICKETS_URL, `searchId=${searchId}`].join("?")

    console.log("Getting tickets from", ticketsUrl)

    return await axios
      .get(ticketsUrl)
      .then(({ data }) => data)
      .catch((e) => {
        throw e
      })
  }

  async function main() {
    const searchId = await getSearchId()

    let requestCount = 1
    const ticketsList = []

    while (true) {
      console.log("Getting tickets, request count:", requestCount)

      let res

      try {
        res = await getTickets(searchId)
        requestCount++
      } catch (e) {
        console.error("Error getting tickets:", e.message)
        break
      }

      const { stop, tickets } = res

      console.log(`Got ${tickets.length} tickets, stop:`, stop)

      if (stop) {
        break
      }

      ticketsList.push(...tickets)
    }

    setFullTicketsList(ticketsList)
    setTicketList(ticketsList.splice(0, 5))

    console.log("Got all possible tickets!", "Total count:", ticketsList.length)
  }

  function timeStandartDateFormat(value) {
    if (value) {
      let a = new Date(value),
        h =
          a.getHours().toString().length === 1
            ? "0" + a.getHours()
            : a.getHours(),
        m =
          a.getMinutes().toString().length === 1
            ? "0" + a.getMinutes()
            : a.getMinutes(),
        time = h + ":" + m
      return time
    }
  }

  function finishTime(start, finish) {
    if (start && finish) {
      let a = new Date(new Date(start).getTime() + finish * 60000),
        b = new Date(new Date(start).getDate() + finish * 60000),
        h =
          a.getHours().toString().length === 1
            ? "0" + a.getHours()
            : a.getHours(),
        m =
          a.getMinutes().toString().length === 1
            ? "0" + a.getMinutes()
            : a.getMinutes(),
        time = h + ":" + m,
        d = new Date(start).getDay() - b.getDay()

      if (d > 0) {
        time += ` (+${d})`
      }
      return time
    }
  }

  function minToHours(minutes) {
    let time = ""
    var h = (minutes / 60) ^ 0
    if (h) {
      var m = minutes % 60

      if (m < 10) m = "0" + m

      time = h + "ч " + m + "м"
    } else {
      time = minutes + "м"
    }
    return time
  }

  useEffect(() => {
    main()
  }, [])

  let inputs = document.querySelectorAll("input[type=checkbox]")

  inputs.forEach((i) => {
    if (!i.checked) {
      console.log(i.value)
    }
  })

  return (
    <>
      <img src="./logo.svg" alt="" />
      <div className="main-container">
        <div className="filters">
          <div className="title title-filter">Количество пересадок</div>
          <div className="list">
            <div className="checkbox">
              <input
                className="custom-checkbox"
                type="checkbox"
                id="all"
                name="all"
                value="all"
              />
              <label htmlFor="all">Все</label>
            </div>

            <div className="checkbox">
              <input
                className="custom-checkbox"
                type="checkbox"
                id="without-transfer"
                name="without-transfer"
                value="without-transfer"
              />
              <label htmlFor="without-transfer">Без пересадок</label>
            </div>

            <div className="checkbox">
              <input
                className="custom-checkbox"
                type="checkbox"
                id="1-transfer"
                name="1-transfer"
                value="1-transfer"
              />
              <label htmlFor="1-transfer">1 пересадка</label>
            </div>

            <div className="checkbox">
              <input
                className="custom-checkbox"
                type="checkbox"
                id="2-transfers"
                name="2-transfers"
                value="2-transfers"
              />
              <label htmlFor="2-transfers">2 пересадки</label>
            </div>

            <div className="checkbox">
              <input
                className="custom-checkbox"
                type="checkbox"
                id="3-transfers"
                name="3-transfers"
                value="3-transfers"
              />
              <label htmlFor="3-transfers">3 пересадки</label>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="options">
            <div
              className="title option"
              onClick={() => {
                // setTicketList(
                console.log(
                  ticketList.sort((a, b) => (a.price > b.price ? 1 : -1))
                )
              }}
            >
              Самый дешёвый
            </div>
            <div
              className="title option"
              onClick={() => {
                console.log(
                  ticketList.sort((a, b) => {
                    a = a.segments[0].duration + a.segments[1].duration
                    b = b.segments[0].duration + b.segments[1].duration
                    console.log(a > b ? 1 : -1)
                    // console.log(b.segments[0].duration + b.segments[1].duration)
                    // a.segments[0].duration + a.segments[1].duration >
                    // b.segments[0].duration + b.segments[1].duration
                    //   ? 1
                    //   : -1
                  })
                )
              }}
            >
              Самый быстрый
            </div>
            <div
              className="title option"
              onClick={() => {
                console.log(
                  ticketList.sort((a, b) =>
                    a.price + a.segments[0].duration + a.segments[1].duration >
                    b.price + b.segments[0].duration + b.segments[1].duration
                      ? 1
                      : -1
                  )
                )
              }}
            >
              Оптимальный
            </div>
          </div>

          <div className="results">
            {ticketList.map(({ price, carrier, segments }) => {
              return (
                <div className="res1">
                  <div className="price">{price} P</div>
                  <img
                    src={`//pics.avs.io/99/36/${carrier}.png`}
                    alt={carrier}
                    className="carrier"
                  />
                  <div className="details">
                    {segments.map(
                      ({ date, destination, duration, origin, stops }) => {
                        return (
                          <>
                            <div className="subtitle">{`${origin} - ${destination}`}</div>
                            <div className="subtitle">В пути</div>
                            <div className="subtitle">
                              {stops.length === 0
                                ? "Без пересадок"
                                : stops.length === 1
                                ? `${stops.length} пересадка`
                                : stops.length >= 2 && stops.length <= 4
                                ? `${stops.length} пересадки`
                                : `${stops.length} пересадок`}
                            </div>

                            <div className="title">
                              {`${timeStandartDateFormat(date)}
                                - ${finishTime(date, duration)}`}
                            </div>
                            <div className="title">{minToHours(duration)}</div>
                            <div className="title">{stops.join(", ")}</div>
                          </>
                        )
                      }
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            className="title more"
            onClick={() => {
              setTicketList(fullTicketsList.splice(0, 10))
            }}
          >
            Показать ещё 5 билетов!
          </button>
        </div>
      </div>
    </>
  )
}

export default App
