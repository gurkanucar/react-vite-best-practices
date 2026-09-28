import { CarOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons'
import { App, Button, Col, Divider, Empty, Flex, Modal, Row, Select, Typography } from 'antd'
import { useState } from 'react'
import {
  findGeneration,
  generationName,
  generations,
  makes,
  vehicleName,
  yearsOf,
  type Vehicle,
} from '@/features/showcases/data/partsVehicles'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { usePartsStore } from '@/features/showcases/hooks/usePartsStore'

interface VehiclePickerProps {
  submitLabel: string
  /** Called with the saved car's id once make, model, year and engine are all chosen. */
  onPicked?: (id: string) => void
  /** Four columns side by side on a wide screen, as in the home page hero. */
  wide?: boolean
}

/** Make → model → year → engine; each choice narrows the next and clears the ones after it. */
export function VehiclePicker({ submitLabel, onPicked, wide = false }: VehiclePickerProps) {
  const { text } = usePartsCopy()
  const { message } = App.useApp()
  const addVehicle = usePartsStore((state) => state.addVehicle)
  const [make, setMake] = useState<string>()
  const [generationId, setGenerationId] = useState<string>()
  const [year, setYear] = useState<number>()
  const [engineId, setEngineId] = useState<string>()
  const [tried, setTried] = useState(false)

  const generation = generationId ? findGeneration(generationId) : undefined
  const complete = Boolean(make && generation && year && engineId)

  const submit = () => {
    setTried(true)
    if (!generation || !year || !engineId) return
    const id = addVehicle({ generationId: generation.id, year, engineId })
    if (!id) return
    void message.success(
      text.garage.added(vehicleName({ id, generationId: generation.id, year, engineId })),
    )
    setMake(undefined)
    setGenerationId(undefined)
    setYear(undefined)
    setEngineId(undefined)
    setTried(false)
    onPicked?.(id)
  }

  const span = wide ? { xs: 24, sm: 12, lg: 6 } : { xs: 24, sm: 12 }

  return (
    <div className="parts-picker">
      <Row gutter={[12, 12]}>
        <Col {...span}>
          <Select
            size="large"
            className="full-width"
            aria-label={text.garage.make}
            placeholder={text.garage.makePlaceholder}
            value={make}
            options={makes.map((value) => ({ value, label: value }))}
            onChange={(value) => {
              setMake(value)
              setGenerationId(undefined)
              setYear(undefined)
              setEngineId(undefined)
            }}
          />
        </Col>
        <Col {...span}>
          <Select
            size="large"
            className="full-width"
            aria-label={text.garage.model}
            placeholder={text.garage.modelPlaceholder}
            disabled={!make}
            value={generationId}
            options={generations
              .filter((entry) => entry.make === make)
              .map((entry) => ({
                value: entry.id,
                label: `${entry.model} ${entry.code} · ${entry.yearFrom}–${entry.yearTo}`,
              }))}
            onChange={(value) => {
              setGenerationId(value)
              setYear(undefined)
              setEngineId(undefined)
            }}
          />
        </Col>
        <Col {...span}>
          <Select
            size="large"
            className="full-width"
            aria-label={text.garage.year}
            placeholder={text.garage.yearPlaceholder}
            disabled={!generation}
            value={year}
            options={(generation ? yearsOf(generation) : []).map((value) => ({
              value,
              label: String(value),
            }))}
            onChange={setYear}
          />
        </Col>
        <Col {...span}>
          <Select
            size="large"
            className="full-width"
            aria-label={text.garage.engine}
            placeholder={text.garage.enginePlaceholder}
            disabled={!year}
            value={engineId}
            options={(generation?.engines ?? []).map((entry) => ({
              value: entry.id,
              label: `${entry.label} · ${entry.kw} kW`,
            }))}
            onChange={setEngineId}
          />
        </Col>
      </Row>
      {tried && !complete && (
        <Typography.Text type="danger" className="parts-picker__error">
          {text.garage.required}
        </Typography.Text>
      )}
      <Button
        type="primary"
        size="large"
        icon={<CarOutlined />}
        block
        className="parts-picker__submit"
        onClick={submit}
      >
        {submitLabel}
      </Button>
    </div>
  )
}

function GarageRow({ vehicle, active }: { vehicle: Vehicle; active: boolean }) {
  const { text } = usePartsCopy()
  const selectVehicle = usePartsStore((state) => state.selectVehicle)
  const removeVehicle = usePartsStore((state) => state.removeVehicle)
  const closeGarage = usePartsStore((state) => state.closeGarage)
  const generation = findGeneration(vehicle.generationId)
  const name = vehicleName(vehicle)

  return (
    <li className={active ? 'parts-garage__row is-active' : 'parts-garage__row'}>
      <CarOutlined className="parts-garage__icon" aria-hidden="true" />
      <div className="parts-garage__name">
        <Typography.Text strong>{name}</Typography.Text>
        {generation && (
          <Typography.Text type="secondary">{generationName(generation)}</Typography.Text>
        )}
      </div>
      <Flex gap={4} align="center">
        {active ? (
          <Typography.Text type="success">
            <CheckOutlined /> {text.garage.selected}
          </Typography.Text>
        ) : (
          <Button
            size="small"
            onClick={() => {
              selectVehicle(vehicle.id)
              closeGarage()
            }}
          >
            {text.garage.use}
          </Button>
        )}
        <Button
          size="small"
          type="text"
          danger
          icon={<DeleteOutlined />}
          aria-label={text.garage.removeLabel(name)}
          onClick={() => removeVehicle(vehicle.id)}
        />
      </Flex>
    </li>
  )
}

export function GarageModal() {
  const { text } = usePartsCopy()
  const open = usePartsStore((state) => state.garageOpen)
  const closeGarage = usePartsStore((state) => state.closeGarage)
  const garage = usePartsStore((state) => state.garage)
  const activeVehicleId = usePartsStore((state) => state.activeVehicleId)
  const selectVehicle = usePartsStore((state) => state.selectVehicle)

  return (
    <Modal open={open} onCancel={closeGarage} footer={null} title={text.garage.title}>
      <Typography.Paragraph type="secondary">{text.garage.description}</Typography.Paragraph>
      <Typography.Text strong>{text.garage.saved}</Typography.Text>
      {garage.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.garage.empty} />
      ) : (
        <ul className="parts-garage__list">
          {garage.map((vehicle) => (
            <GarageRow key={vehicle.id} vehicle={vehicle} active={vehicle.id === activeVehicleId} />
          ))}
        </ul>
      )}
      {activeVehicleId && (
        <Flex justify="end">
          <Button
            type="link"
            onClick={() => {
              selectVehicle(null)
              closeGarage()
            }}
          >
            {text.garage.clear}
          </Button>
        </Flex>
      )}
      <Divider titlePlacement="start" plain>
        {text.garage.add}
      </Divider>
      <VehiclePicker submitLabel={text.garage.save} onPicked={closeGarage} />
    </Modal>
  )
}
