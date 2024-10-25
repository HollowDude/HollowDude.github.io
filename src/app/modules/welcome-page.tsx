import Link from "next/link"
import styles from './welcome-page.module.css'

const Button = ({ children, href, className } : {children : any, href : any, className : any}) => (
  <Link href={href}>
    
  </Link>
)

export default function Component() {
  return (
    <div className={styles.container}>
      <div className={`${styles.section} ${styles.piercingsSection}`}>
        <h2>Piercings</h2>
        <p>
          Descubre nuestra amplia gama de piercings y joyería corporal. Expresa tu estilo único con nuestras opciones de alta calidad y diseños innovadores.
        </p>
        <Button href="https://piercings.vinilostudio.com" className={styles.piercingsButton}>
          Visitar Tienda de Piercings
        </Button>
      </div>
      <div className={`${styles.section} ${styles.tattoosSection}`}>
        <h2>Tatuajes</h2>
        <p>
          Explora nuestro portafolio de tatuajes y encuentra inspiración para tu próxima obra de arte corporal. Trabajamos con artistas talentosos para crear diseños únicos y personalizados.
        </p>
        <Button href="https://tatuajes.vinilostudio.com" className={styles.tattoosButton}>
          Visitar Galería de Tatuajes
        </Button>
      </div>
    </div>
  )
}