import React from 'react'
import { IService } from '../types'

interface IServiceSingleProps {
  service: IService
  formatDuration: (minutes: number) => string
  windowWidth: number
  kesto: boolean
  kuvaus: boolean
}

const ServiceSingle: React.FC<IServiceSingleProps> = ({
  service,
  formatDuration,
  windowWidth,
  kesto,
  kuvaus,
}) => {
  const kuvausTeksti = service?.kuvaus?.split(/\n+/) ?? ['']

  return (
    <>
      {windowWidth > 800 ? (
        <tr>
          <td className='max-content'>
            <span>
              {service.tarkennus ? `${service.nimi}:` : `${service.nimi}`}{' '}
              {service.tarkennus}
            </span>
          </td>
          {kesto && (
            <td>
              <span>
                {Number(service.kesto) === 0 ? '' : formatDuration(service.kesto)}
              </span>
            </td>
          )}
          <td>
            <span>{service.hinta.toString().replace('.', ',')} €</span>
          </td>
          {kuvaus && (
            <td className='kuvaus'>
              <span>
                {kuvausTeksti[0] !== '' &&
                  kuvausTeksti?.map((rivi, index) => {
                    return <span key={index}>{rivi}</span>
                  })}
              </span>
            </td>
          )}
        </tr>
      ) : (
        <li className='single'>
          <div>
            <span>
              <strong>{service.nimi}</strong>
            </span>
            <span>{service.tarkennus}</span>
          </div>
          <div>
            <span>{formatDuration(service.kesto)}</span>
            <span>{service.hinta.toString().replace('.', ',')} €</span>
          </div>
          {kuvausTeksti[0] !== '' && (
            <div>
              <span>
                {kuvausTeksti?.map((rivi, index) => {
                  return <span key={index}>{rivi}</span>
                })}
              </span>
            </div>
          )}
        </li>
      )}
    </>
  )
}

export default ServiceSingle
