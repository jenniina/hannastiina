import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/useAppDispatch'
import Accordion from './Accordion'
import Select, { SelectOption } from './Select'
import {
  fetchServices,
  // searchPriceRange,
  // fetchServiceByName,
  addService,
  updateService,
  deleteService,
} from '../reducers/serviceReducer'
import { fetchCategories } from '../reducers/categoryReducer'
import { fetchOrderBy } from '../reducers/orderByReducer'
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from 'react'
import { IService, IReducers, IClosestItem, ICategoryItems, ICategory } from '../types'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import ServiceSingleEdit from './ServiceSingleEdit'
import { notify } from '../reducers/notificationReducer'

interface Props {
  formatDuration: (minutes: number) => string
  handleScrollToElement: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void
}

const ServiceEdit = ({ formatDuration, handleScrollToElement }: Props) => {
  const dispatch = useAppDispatch()
  const { services, loading, error } = useSelector((state: IReducers) => state.services)
  const [filteredServices, setFilteredServices] = useState<IService[] | undefined>(
    undefined
  )
  const { categories } = useSelector((state: IReducers) => state.categories)

  const { listItemsByCategory, handleUpdate, handleDragging } = useDragAndDrop(
    filteredServices as IService[]
  )

  const cat = categories[0]
  const firstLetter = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
  const rest = cat?.kategoria.slice(1) ?? ''
  const kategoria = firstLetter + rest
  const [category_, setCategory] = useState<SelectOption>({
    value: categories[0]?.id as number,
    label: kategoria,
  })

  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')
  const [price, setPrice] = useState('')
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)
  const [searchName, setSearchName] = useState('')
  const [duration, setDuration] = useState(0)
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [filterBy, setFilterBy] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories()).catch((error) => console.error(error))
    dispatch(fetchOrderBy())
      .then(() => dispatch(fetchServices()))
      .catch((error) => console.error(error))
  }, [dispatch])

  const onDrop = async (id: number, category: string, targetIndex: number) => {
    handleUpdate(id, category, targetIndex)
      .then(() => dispatch(fetchServices()))
      // .then((fetchedServices) => {
      //   setFilteredServices(fetchedServices.payload as IService[])
      // })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    if (filterBy === 'name') {
      setFilteredServices(
        services?.filter((service) =>
          service.nimi?.toLowerCase()?.includes(searchName?.toLowerCase())
        )
      )
    } else if (filterBy === 'price') {
      setFilteredServices(
        services?.filter((service) => service.hinta >= min && service.hinta <= max)
      )
    } else setFilteredServices(services)
  }, [services, filterBy, searchName, min, max])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSearchNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterBy('name')
    setSearchName(event.target.value)
  }
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setPrice(value.replace(',', '.'))
  }

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!isNaN(Number(value)) || value === '') {
      setDuration(Number(value))
    }
  }
  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const handleAddService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newService: IService = {
      nimi: name,
      kategoria: category_?.value as number,
      tarkennus: detail,
      hinta: Number(price.replace(',', '.')),
      kesto: duration,
      kuvaus: description,
    }
    dispatch(addService(newService))
      .then(() => {
        reset()
        dispatch(fetchServices())
      })
      .then(() => dispatch(notify('Palvelu lisätty', false, 5)))
      .catch((error) => console.error(error))
  }

  const mapCategoriesToOptions = useCallback(
    (categories: ICategory[]) => {
      return categories?.map((category) => {
        const cat = categories?.find((c) => c?.id === category?.id)
        const firstLetter = cat?.kategoria?.charAt(0)?.toUpperCase() ?? ''
        const rest = cat?.kategoria.slice(1) ?? ''
        const kategoria = firstLetter + rest
        return {
          value: category?.id,
          label: kategoria,
        }
      }) as SelectOption[]
    },
    [categories]
  )

  const options = mapCategoriesToOptions(categories)

  const reset = () => {
    setEditOpen(false)
    setEditId(-1)
    setName('')
    setCategory(options[0])
    setDetail('')
    setPrice('')
    setDuration(0)
    setDescription('')
    setAddOpen(false)
  }

  const resetAdd = () => {
    setEditOpen(false)
    setEditId(-1)
    setName('')
    setCategory(options[0])
    setDetail('')
    setPrice('')
    setDuration(0)
    setDescription('')
  }

  // const handleSearchServiceByName = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   dispatch(fetchServiceByName(searchName))
  // }

  // const handleSearchServiceByPrice = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   dispatch(searchPriceRange({ min: min, max: max })).then((response) => {
  //     console.error(response)
  //   })
  // }

  const handleSearchServiceByPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilterBy('price')
  }

  const handleFetchServices = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dispatch(fetchServices()).catch((error) => console.error(error))
    setEditOpen(false)
    setFilterBy('')
    setEditId(-1)
    setAddOpen(false)

    const anchor = document.querySelector(`#palvelulista`)
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Haluatko varmasti poistaa palvelun? Poistoa ei voi peruuttaa.'))
      dispatch(deleteService(id))
        .then(() => dispatch(fetchServices()))
        .then(() => dispatch(notify('Palvelu poistettu', false, 5)))
        .catch((error) => console.error(error))
  }

  const handleEditService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const editedService: IService = {
      nimi: name,
      kategoria: category_?.value as number,
      tarkennus: detail,
      hinta: Number(price.replace(',', '.')),
      kesto: duration,
      kuvaus: description,
    }
    dispatch(updateService({ id: editId, newObject: editedService }))
      .then(() => {
        reset()
        dispatch(fetchServices())
      })
      .then(() => dispatch(notify('Palvelu päivitetty', false, 5)))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    setTimeout(() => {
      // Set z-index of select containers so that they do not open behind the next select container
      const selectContainers = document.querySelectorAll(
        '.select-container'
      ) as NodeListOf<HTMLDivElement>
      const totalContainers = selectContainers?.length + 2

      selectContainers?.forEach((container, index) => {
        const zIndex = totalContainers - index
        container.style.zIndex = `${zIndex}`
      })
    }, 500)
  }, [editOpen, addOpen])

  return (
    <div id='palvelut' className='edit'>
      <section className='card'>
        <h2>Palvelut</h2>

        <h3>Muokkaa palveluita</h3>
        <div className='controls'>
          <div className='input-wrap searchname'>
            <label htmlFor='searchname2'>
              <span>Etsi palvelua nimen perusteella</span>
            </label>
            <span className='input'>
              <input
                id='searchname2'
                placeholder='Etsi...'
                value={searchName}
                onChange={handleSearchNameChange}
              />
            </span>
          </div>
          <form className='minmax' onSubmit={(e) => handleSearchServiceByPrice(e)}>
            <legend>Rajaa hinnan perusteella</legend>
            <div>
              <label htmlFor='min2' className='scr'>
                Minimihinta
              </label>
              <input
                id='min2'
                className='narrow bg'
                type='number'
                min={0}
                name='min'
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
              />
              &ndash;
              <label htmlFor='max2' className='scr'>
                Maksimihinta
              </label>
              <input
                id='max2'
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

          <Accordion
            text='Lisää uusi palvelu tästä'
            className='add-service'
            id='add-service'
            onClick={() => {
              resetAdd()
            }}
            isOpen={addOpen}
            setIsFormOpen={setAddOpen}
          >
            <>
              <h4>Lisää uusi palvelu</h4>
              <form onSubmit={(e) => handleAddService(e)}>
                <div>
                  <Select
                    className='category-select'
                    id='category-new'
                    value={category_}
                    onChange={(o) => setCategory(o as SelectOption)}
                    options={options}
                    instructions='Valitse kategoria'
                    selectAnOption='Valitse kategoria'
                  />
                </div>
                <div className='input-wrap'>
                  <label htmlFor='name'>Palvelun nimi</label>
                  <span className='input'>
                    <input id='name' value={name} onChange={handleNameChange} />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='detail'>Tarkennus</label>
                  <span className='input'>
                    <input
                      id='detail'
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='price'>Palvelun hinta (€)</label>
                  <span className='input'>
                    <input
                      id='price'
                      type='text'
                      value={price}
                      onChange={handlePriceChange}
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label htmlFor='duration'>Palvelun kesto (minuuteissa)</label>
                  <span className='input'>
                    <input
                      id='duration'
                      value={duration}
                      onChange={handleDurationChange}
                    />
                  </span>
                </div>
                <div>
                  <label htmlFor='description'>Palvelun kuvaus</label>
                  <textarea
                    id='description'
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={5}
                  />
                </div>

                <button type='submit'>Lisää palvelu</button>
              </form>
            </>
          </Accordion>
        </div>
        <p>
          Vedä ja pudota palvelut haluamaasi järjestykseen kategoriansa sisällä. Uusi
          järjestys tallentuu automaattisesti. Paina palvelun "Muokkaa" painiketta
          halutessasi vaihtaa sen kategoriaa tai muita tietoja.
        </p>
        <ul className='palvelulista' id='palvelulista'>
          {loading ? (
            <li>Ladataan...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            <>
              {listItemsByCategory &&
                Object.entries(listItemsByCategory as ICategoryItems)?.map(
                  ([category, services]) => {
                    if (services?.length === 0 && searchName !== '') {
                      return null // Don't render the category if there are no services
                    }
                    const firstLetter = category?.charAt(0)?.toUpperCase() ?? ''
                    const rest = category?.slice(1) ?? ''
                    const kategoria = `${firstLetter}${rest}`
                    return (
                      <li key={category} className={`kategoria`}>
                        <h3>{kategoria}</h3>
                        <ul
                          className={`palvelut`}
                          onDragOver={(e) => {
                            e.preventDefault()
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            const draggedId = e.dataTransfer.getData('application/my-app')

                            // Find the closest item to the drop position
                            const closestItem = Array.from(
                              e.currentTarget.querySelectorAll('.palvelut > li')
                            )?.reduce<IClosestItem>(
                              (closest, child) => {
                                const box = child.getBoundingClientRect()
                                const offset = Math.abs(box.top - e.clientY)
                                if (offset < closest.offset) {
                                  return { offset, element: child as HTMLElement }
                                } else {
                                  return closest
                                }
                              },
                              { offset: Number.POSITIVE_INFINITY }
                            )

                            // Use the index of the closest item as the new target index
                            const newTargetIndex = Array.from(
                              e.currentTarget.querySelectorAll('.palvelut > li')
                            ).indexOf(closestItem.element as HTMLElement)

                            onDrop(Number(draggedId), category, newTargetIndex)
                          }}
                        >
                          {services?.length === 0 ? (
                            <li className='empty'>
                              <button
                                className='reset'
                                onClick={(e) => {
                                  setAddOpen(true)
                                  handleScrollToElement(e, 'add-service-container')
                                }}
                              >
                                Lisää palvelu
                              </button>{' '}
                            </li>
                          ) : (
                            services?.map((service) => (
                              <li
                                className={`${editOpen ? 'open' : ''}`}
                                key={service?.id}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData(
                                    'application/my-app',
                                    service?.id?.toString() as string
                                  )
                                  e.dataTransfer.effectAllowed = 'move'
                                  handleDragging(true)
                                }}
                                onDragEnd={() => handleDragging(false)}
                              >
                                <ServiceSingleEdit
                                  service={service}
                                  editOpen={editOpen}
                                  setEditOpen={setEditOpen}
                                  setAddOpen={setAddOpen}
                                  editId={editId}
                                  setEditId={setEditId}
                                  setName={setName}
                                  setCategory={setCategory}
                                  setDetail={setDetail}
                                  setPrice={setPrice}
                                  setDuration={setDuration}
                                  setDescription={setDescription}
                                  handleEditService={handleEditService}
                                  handleDelete={handleDelete}
                                  formatDuration={formatDuration}
                                  name={name}
                                  category={category_}
                                  detail={detail}
                                  price={price}
                                  duration={duration}
                                  description={description}
                                  options={options}
                                  categories={categories}
                                  handleNameChange={handleNameChange}
                                  handlePriceChange={handlePriceChange}
                                  handleDurationChange={handleDurationChange}
                                  handleDescriptionChange={handleDescriptionChange}
                                />
                              </li>
                            ))
                          )}
                        </ul>
                      </li>
                    )
                  }
                )}

              {/* {filteredServices?.map((service) => {
              return (
                <ServiceByCategory
                  key={service.id}
                  services={services}
                  editOpen={editOpen}
                  setEditOpen={setEditOpen}
                  setAddOpen={setAddOpen}
                  editId={editId}
                  setEditId={setEditId}
                  setName={setName}
                  setCategory={setCategory}
                  setDetail={setDetail}
                  setPrice={setPrice}
                  setDuration={setDuration}
                  setDescription={setDescription}
                  handleEditService={handleEditService}
                  handleDelete={handleDelete}
                  formatDuration={formatDuration}
                  name={name}
                  category_={category}
                  detail={detail}
                  price={price}
                  duration={duration}
                  description={description}
                  options={options}
                  categories={categories}
                  handleNameChange={handleNameChange}
                  handlePriceChange={handlePriceChange}
                  handleDurationChange={handleDurationChange}
                  handleDescriptionChange={handleDescriptionChange}
                />
              )
            })} */}
            </>
          )}
        </ul>
      </section>
    </div>
  )
}

export default ServiceEdit
