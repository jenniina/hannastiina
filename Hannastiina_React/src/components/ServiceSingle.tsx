import React from 'react'
import { IService } from '../types'

interface IServiceSingleProps {
  service: IService
  formatDuration: (minutes: number) => string
  windowWidth: number
}

const ServiceSingle: React.FC<IServiceSingleProps> = ({
  service,
  formatDuration,
  windowWidth,
}) => {
  const kuvaus = service?.kuvaus?.split(/\n+/) ?? ['']

  return (
    <>
      {windowWidth > 800 ? (
        <tr>
          <td className='max-content'>
            <span>
              {service.nimi}: {service.tarkennus}
            </span>
          </td>
          <td>
            <span>{formatDuration(service.kesto)}</span>
          </td>
          <td>
            <span>{service.hinta.toString().replace('.', ',')} €</span>
          </td>
          <td className='kuvaus'>
            <span>
              {kuvaus[0] !== '' &&
                kuvaus?.map((rivi, index) => {
                  return <span key={index}>{rivi}</span>
                })}
            </span>
          </td>
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
          {kuvaus[0] !== '' && (
            <div>
              <span>
                {kuvaus?.map((rivi, index) => {
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
