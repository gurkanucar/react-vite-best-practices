import { Image } from 'antd'

/** The detail mosaic: one tall frame beside a two-by-two grid. */
export function TourGallery({ images, alt }: { images: string[]; alt: string }) {
  const [lead, ...rest] = images

  return (
    <Image.PreviewGroup>
      <div className="tour-mosaic tour-mosaic--detail">
        {lead && <Image src={lead} alt={alt} className="tour-mosaic__lead" />}
        {rest.slice(0, 4).map((image) => (
          <Image key={image} src={image} alt={alt} />
        ))}
      </div>
    </Image.PreviewGroup>
  )
}
