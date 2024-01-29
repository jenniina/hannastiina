import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { fetchServices } from '../reducers/serviceReducer'
import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { IService, IReducers, ICategoryState, ICategoryItems } from '../types'
import { fetchCategories } from '../reducers/categoryReducer'
import ServiceSingle from './ServiceSingle'

interface Props {
  formatDuration: (minutes: number) => string
  windowWidth: number
}

const ServiceList = ({ formatDuration, windowWidth }: Props) => {
  const dispatch = useAppDispatch()
  const { services, loading, error } = useSelector((state: IReducers) => state.services)
  const [filteredServices, setFilteredServices] = useState<IService[]>(services)
  const [filteredServicesByCategory, setFilteredServicesByCategory] =
    useState<CategoryItems>()
  const { categories } = useSelector(
    (state: IReducers) => state.categories
  ) as ICategoryState

  const [filterBy, setFilterBy] = useState('')
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)
  const [searchName, setSearchName] = useState('')

  interface CategoryItems {
    [key: string]: IService[]
  }

  useEffect(() => {
    if (filterBy === 'name') {
      setFilteredServices(
        services?.filter(
          (service) =>
            service.nimi?.toLowerCase().includes(searchName?.toLowerCase()) ||
            service.tarkennus?.toLowerCase().includes(searchName?.toLowerCase())
        )
      )
    } else if (filterBy === 'price') {
      setFilteredServices(
        services?.filter((service) => service.hinta >= min && service.hinta <= max)
      )
    } else setFilteredServices(services)
  }, [services, filterBy, searchName, min, max])

  useEffect(() => {
    const newListItemsByCategory = categories.reduce((acc: CategoryItems, category) => {
      const itemsInCategory = filteredServices?.filter(
        (item) => item?.kategoria === category.id
      )
      acc[category.kategoria] = itemsInCategory
      return acc
    }, {})

    setFilteredServicesByCategory(newListItemsByCategory)
  }, [categories, filteredServices])

  useEffect(() => {
    dispatch(fetchCategories()).catch((error) => console.error(error))
  }, [dispatch])

  const handleSearchNameChange = (event: any) => {
    setFilterBy('name')
    setSearchName(event.target.value)
  }

  useEffect(() => {
    dispatch(fetchServices()).catch((error) => console.error(error))
  }, [dispatch])

  const handleSearchServiceByPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilterBy('price')
  }

  const handleFetchServices = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setSearchName('')
    setMin(0)
    setMax(100)
    setFilterBy('')
    dispatch(fetchServices()).catch((error) => console.error(error))

    const anchor = document.querySelector(`#palvelulista`)
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div id='palvelut' className='public card'>
      <section className='card'>
        <h2>Palvelut</h2>
        <div className='controls'>
          <div className='input-wrap searchname'>
            <label htmlFor='searchname'>
              <span>Etsi palvelua nimen perusteella</span>
            </label>
            <span className='input'>
              <input
                id='searchname'
                placeholder='Etsi...'
                value={searchName}
                onChange={handleSearchNameChange}
              />
            </span>
          </div>
          <form className='minmax' onSubmit={(e) => handleSearchServiceByPrice(e)}>
            <legend>Rajaa hinnan perusteella</legend>
            <div>
              <label htmlFor='min' className='scr'>
                Minimihinta
              </label>
              <input
                id='min'
                className='narrow bg'
                type='number'
                min={0}
                name='min'
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
              />
              &ndash;
              <label htmlFor='max' className='scr'>
                Maksimihinta
              </label>
              <input
                id='max'
                className='narrow bg'
                type='number'
                min={10}
                name='max'
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
              />
              €
            </div>
            <button type='submit'>Rajaa</button>
            <button
              type='button'
              onClick={() => {
                setFilterBy('')
                setMin(0)
                setMax(100)
                setSearchName('')
              }}
            >
              Peru
            </button>
          </form>
          <button onClick={handleFetchServices}>Näytä kaikki palvelut</button>
        </div>

        <ul className='palvelulista' id='palvelulista'>
          {loading ? (
            <li>Ladataan...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            <>
              {filteredServicesByCategory &&
                Object.entries(filteredServicesByCategory as ICategoryItems)?.map(
                  ([category, services]) => {
                    if (services?.length === 0) {
                      return null // Don't render the category if there are no services
                    }
                    const firstLetter = category?.charAt(0)?.toUpperCase() ?? ''
                    const rest = category?.slice(1) ?? ''
                    const kategoria = `${firstLetter}${rest}`
                    return (
                      <li key={category} className={`kategoria`}>
                        <h3>{kategoria}</h3>

                        {windowWidth > 800 ? (
                          <table>
                            <thead>
                              <tr>
                                <th className='max-content'>Palvelu</th>
                                {services?.some((service) => service.kesto > 0) && (
                                  <th className='narrow'>Kesto</th>
                                )}
                                <th className='narrow'>Hinta</th>
                                {services?.some(
                                  (service) =>
                                    service.kuvaus && service.kuvaus.trim() !== ''
                                ) && <th className='kuvaus'>Kuvaus</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {services?.map((service) => (
                                <ServiceSingle
                                  key={service.id}
                                  service={service}
                                  formatDuration={formatDuration}
                                  windowWidth={windowWidth}
                                  kesto={services?.some((service) => service.kesto > 0)}
                                  kuvaus={services?.some(
                                    (service) =>
                                      service.kuvaus && service.kuvaus.trim() !== ''
                                  )}
                                />
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <ul className={`palvelut`}>
                            {services?.map((service) => (
                              <ServiceSingle
                                key={service.id}
                                service={service}
                                formatDuration={formatDuration}
                                windowWidth={windowWidth}
                                kesto={services?.some((service) => service.kesto > 0)}
                                kuvaus={services?.some(
                                  (service) =>
                                    service.kuvaus && service.kuvaus.trim() !== ''
                                )}
                              />
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  }
                )}
            </>
          )}
        </ul>
      </section>
    </div>
  )
}

export default ServiceList
