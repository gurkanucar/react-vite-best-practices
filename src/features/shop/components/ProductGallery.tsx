import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Image } from 'antd'
import { useMessages } from '@/i18n/messages'

interface ProductGalleryProps {
  images: string[]
  activeIndex: number
  onChange: (index: number) => void
  alt: string
}

export function ProductGallery({ images, activeIndex, onChange, alt }: ProductGalleryProps) {
  const messages = useMessages()
  const step = (delta: number) => onChange((activeIndex + delta + images.length) % images.length)

  return (
    <Flex vertical gap={12}>
      <div className="product-gallery">
        {/* One preview group over every frame, so the lightbox can page through them too. */}
        <Image.PreviewGroup>
          {images.map((image, index) => (
            /*
             * Every frame stays mounted so the lightbox has the whole set to page
             * through; only the selected one is shown in the page itself.
             */
            <div key={image} hidden={index !== activeIndex}>
              <Image src={image} alt={alt} className="product-gallery__frame" />
            </div>
          ))}
        </Image.PreviewGroup>

        <Flex align="center" gap={4} className="product-gallery__pager">
          <Button
            size="small"
            type="text"
            aria-label={messages.shop.previousImage}
            icon={<LeftOutlined aria-hidden="true" />}
            onClick={() => step(-1)}
          />
          <span>
            {activeIndex + 1}/{images.length}
          </span>
          <Button
            size="small"
            type="text"
            aria-label={messages.shop.nextImage}
            icon={<RightOutlined aria-hidden="true" />}
            onClick={() => step(1)}
          />
        </Flex>
      </div>

      <Flex gap={8} wrap>
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`${messages.shop.showImage} ${index + 1}`}
            aria-current={index === activeIndex}
            className={`product-thumb${index === activeIndex ? ' product-thumb--active' : ''}`}
            onClick={() => onChange(index)}
          >
            <img src={image} alt="" />
          </button>
        ))}
      </Flex>
    </Flex>
  )
}
