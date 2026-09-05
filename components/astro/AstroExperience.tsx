'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  photos,
  compare,
  scenes,
  about,
  workflow,
  gear,
  introImage,
  type AstroPhoto,
} from '@/data/astro'
import styles from './astro.module.css'

type Slide =
  | { kind: 'intro' }
  | { kind: 'photo'; photo: AstroPhoto }
  | { kind: 'compare' }
  | { kind: 'scenes' }
  | { kind: 'end' }

function hasDetails(photo: AstroPhoto) {
  return Boolean(photo.description || photo.story?.length || photo.capture?.length)
}

function altFor(photo: AstroPhoto) {
  return photo.catalog ? `${photo.title} (${photo.catalog})` : photo.title
}

export default function AstroExperience() {
  const slides: Slide[] = useMemo(() => {
    const list: Slide[] = [{ kind: 'intro' }]
    for (const photo of photos) {
      list.push({ kind: 'photo', photo })
      if (photo.id === 'andromeda-galaxy') list.push({ kind: 'compare' })
      if (photo.id === 'ring-nebula') list.push({ kind: 'scenes' })
    }
    list.push({ kind: 'end' })
    return list
  }, [])

  const scrollerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const reducedMotion = useRef(false)

  const [active, setActive] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)
  const [showRaw, setShowRaw] = useState(true)

  const activeSlide = slides[active]
  const activePhoto = activeSlide?.kind === 'photo' ? activeSlide.photo : null

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Smooth scrollIntoView is cancelled by mandatory scroll-snap in Chrome,
  // so programmatic navigation animates scrollTop directly.
  const animFrame = useRef<number | null>(null)

  const go = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current
      const target = slideRefs.current[Math.max(0, Math.min(slides.length - 1, index))]
      if (!scroller || !target) return
      if (animFrame.current !== null) cancelAnimationFrame(animFrame.current)
      const to = target.offsetTop
      if (reducedMotion.current) {
        scroller.scrollTop = to
        return
      }
      const from = scroller.scrollTop
      if (from === to) return
      const duration = 420
      const start = performance.now()
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        scroller.scrollTop = from + (to - from) * ease(t)
        animFrame.current = t < 1 ? requestAnimationFrame(step) : null
      }
      animFrame.current = requestAnimationFrame(step)
    },
    [slides.length]
  )

  // A wheel or touch during the animation hands control back to the user
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const cancelAnim = () => {
      if (animFrame.current !== null) {
        cancelAnimationFrame(animFrame.current)
        animFrame.current = null
      }
    }
    scroller.addEventListener('wheel', cancelAnim, { passive: true })
    scroller.addEventListener('touchstart', cancelAnim, { passive: true })
    return () => {
      cancelAnim()
      scroller.removeEventListener('wheel', cancelAnim)
      scroller.removeEventListener('touchstart', cancelAnim)
    }
  }, [])

  // Track the visible slide
  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index))
          }
        }
      },
      { root, threshold: 0.55 }
    )
    slideRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [slides.length])

  // Leaving a slide closes its details panel
  useEffect(() => {
    setDetailsOpen(false)
  }, [active])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') {
        if (indexOpen) setIndexOpen(false)
        else if (detailsOpen) setDetailsOpen(false)
        return
      }
      if (indexOpen) return
      switch (e.key) {
        case 'ArrowDown':
        case 'Down':
        case 'ArrowRight':
        case 'Right':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          go(active + 1)
          break
        case 'ArrowUp':
        case 'Up':
        case 'ArrowLeft':
        case 'Left':
        case 'PageUp':
          e.preventDefault()
          go(active - 1)
          break
        case 'Home':
          e.preventDefault()
          go(0)
          break
        case 'End':
          e.preventDefault()
          go(slides.length - 1)
          break
        case 'i':
        case 'I':
          if (activePhoto && hasDetails(activePhoto)) setDetailsOpen(open => !open)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, detailsOpen, indexOpen, go, slides.length, activePhoto])

  const photoEntries = useMemo(
    () =>
      slides
        .map((slide, index) => (slide.kind === 'photo' ? { photo: slide.photo, index } : null))
        .filter((entry): entry is { photo: AstroPhoto; index: number } => entry !== null),
    [slides]
  )

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={styles.experience}>
      <div className={styles.scroller} ref={scrollerRef}>
        {slides.map((slide, i) => (
          <section
            key={slide.kind === 'photo' ? slide.photo.id : `${slide.kind}-${i}`}
            ref={el => {
              slideRefs.current[i] = el
            }}
            data-index={i}
            id={slide.kind === 'photo' ? slide.photo.id : slide.kind}
            className={
              slide.kind === 'end' || slide.kind === 'scenes'
                ? `${styles.slide} ${styles.slideScroll}`
                : styles.slide
            }
          >
            {slide.kind === 'intro' && (
              <>
                <Image
                  src={introImage}
                  alt="Two figures beneath a starry sky, a camera on a star tracker between them"
                  fill
                  priority
                  sizes="100vw"
                  quality={70}
                  placeholder="blur"
                  className={styles.introImg}
                />
                <div className={styles.introScrim} />
                <div className={styles.introContent}>
                  <span className={styles.kicker}>Aki Bhabad</span>
                  <h1 className={styles.introTitle}>Astrophotography</h1>
                  <p className={styles.introSub}>
                    Nebulae, galaxies, and the night sky — captured from backyards in
                    Connecticut, a beach on Cape Cod, and the summit of Mauna Kea.
                  </p>
                </div>
                <span className={styles.scrollHint} aria-hidden="true">
                  ↓
                </span>
              </>
            )}

            {slide.kind === 'photo' && (
              <div className={styles.photoSlide}>
                <div className={styles.stage}>
                  <Image
                    src={slide.photo.image}
                    alt={altFor(slide.photo)}
                    fill
                    sizes="100vw"
                    quality={85}
                    priority={i === 1}
                    placeholder="blur"
                    className={styles.photoImg}
                  />
                </div>
                <div className={styles.captionBar}>
                  <div className={styles.captionText}>
                    {slide.photo.kicker && (
                      <span className={styles.kicker}>{slide.photo.kicker}</span>
                    )}
                    <h2 className={styles.photoTitle}>
                      {slide.photo.title}
                      {slide.photo.catalog && (
                        <span className={styles.catalog}> · {slide.photo.catalog}</span>
                      )}
                    </h2>
                    <span className={styles.metaLine}>{slide.photo.meta}</span>
                  </div>
                  {hasDetails(slide.photo) && (
                    <button
                      className={styles.detailsBtn}
                      onClick={() => setDetailsOpen(true)}
                      aria-haspopup="dialog"
                    >
                      Details
                    </button>
                  )}
                </div>
              </div>
            )}

            {slide.kind === 'compare' && (
              <div className={styles.photoSlide}>
                <div className={styles.stage}>
                  <Image
                    src={compare.final}
                    alt="Andromeda Galaxy — stacked and processed result"
                    fill
                    sizes="100vw"
                    quality={85}
                    placeholder="blur"
                    className={styles.fadeImg}
                    style={{ opacity: showRaw ? 0 : 1 }}
                  />
                  <Image
                    src={compare.raw}
                    alt="Andromeda Galaxy — a single raw 30-second exposure"
                    fill
                    sizes="100vw"
                    quality={85}
                    placeholder="blur"
                    className={styles.fadeImg}
                    style={{ opacity: showRaw ? 1 : 0 }}
                  />
                </div>
                <div className={styles.captionBar}>
                  <div className={styles.captionText}>
                    <span className={styles.kicker}>Why stacking matters</span>
                    <h2 className={styles.photoTitle}>
                      {showRaw ? compare.rawLabel : compare.finalLabel}
                    </h2>
                    <span className={styles.metaLine}>{compare.note}</span>
                  </div>
                  <div className={styles.segmented} role="group" aria-label="Compare raw frame and processed image">
                    <button aria-pressed={showRaw} onClick={() => setShowRaw(true)}>
                      Raw frame
                    </button>
                    <button aria-pressed={!showRaw} onClick={() => setShowRaw(false)}>
                      Stacked
                    </button>
                  </div>
                </div>
              </div>
            )}

            {slide.kind === 'scenes' && (
              <div className={styles.scenesSlide}>
                <div className={styles.scenesHeader}>
                  <span className={styles.kicker}>In the field</span>
                  <h2 className={styles.sectionTitle}>Behind the scenes</h2>
                </div>
                <div className={styles.scenesGrid}>
                  {scenes.map(scene => (
                    <figure key={scene.caption} className={styles.sceneCard}>
                      <div className={styles.sceneImgWrap}>
                        <Image
                          src={scene.image}
                          alt=""
                          fill
                          sizes="(max-width: 720px) 100vw, 33vw"
                          placeholder="blur"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <figcaption className={styles.sceneCaption}>{scene.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {slide.kind === 'end' && (
              <div className={styles.endSlide}>
                <div className={styles.endInner}>
                  <span className={styles.kicker}>About these images</span>
                  <h2 className={styles.endTitle}>Long nights, small progress</h2>
                  {about.map(paragraph => (
                    <p key={paragraph.slice(0, 32)} className={styles.endBody}>
                      {paragraph}
                    </p>
                  ))}
                  <h3 className={styles.endHeading}>Process</h3>
                  <p className={styles.endBody}>{workflow}</p>
                  <h3 className={styles.endHeading}>Equipment</h3>
                  <dl className={styles.gearList}>
                    {gear.map(group => (
                      <div key={group.category} className={styles.gearRow}>
                        <dt>{group.category}</dt>
                        <dd>{group.items.join(' · ')}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className={styles.endLinks}>
                    <Link href="/" className={styles.backLink}>
                      ← akibhabad.com
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className={styles.topbar}>
        <Link href="/" className={styles.chromeLink}>
          ← akibhabad.com
        </Link>
        <div className={styles.topbarRight}>
          <button className={styles.chromeLink} onClick={() => setIndexOpen(true)}>
            Index
          </button>
          <span className={styles.counter}>
            {pad(active + 1)} / {pad(slides.length)}
          </span>
        </div>
      </div>

      <div
        className={
          detailsOpen && activePhoto
            ? `${styles.panelScrim} ${styles.panelScrimOpen}`
            : styles.panelScrim
        }
        onClick={() => setDetailsOpen(false)}
      />
      <aside
        className={
          detailsOpen && activePhoto ? `${styles.panel} ${styles.panelOpen}` : styles.panel
        }
        role="dialog"
        aria-label="Capture details"
        aria-hidden={!(detailsOpen && activePhoto)}
      >
        {activePhoto && (
          <>
            <div className={styles.panelHeader}>
              <div className={styles.panelHeading}>
                {activePhoto.kicker && <span className={styles.kicker}>{activePhoto.kicker}</span>}
                <h3 className={styles.panelTitle}>
                  {activePhoto.title}
                  {activePhoto.catalog && (
                    <span className={styles.catalog}> · {activePhoto.catalog}</span>
                  )}
                </h3>
                <span className={styles.metaLine}>{activePhoto.meta}</span>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setDetailsOpen(false)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            {activePhoto.description && (
              <p className={styles.panelDesc}>{activePhoto.description}</p>
            )}
            {activePhoto.story?.map(paragraph => (
              <p key={paragraph.slice(0, 32)} className={styles.panelStory}>
                {paragraph}
              </p>
            ))}
            {activePhoto.capture && activePhoto.capture.length > 0 && (
              <dl className={styles.captureList}>
                {activePhoto.capture.map(detail => (
                  <div key={detail.label} className={styles.captureRow}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </aside>

      {indexOpen && (
        <div
          className={styles.indexOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Photo index"
          onClick={() => setIndexOpen(false)}
        >
          <div className={styles.indexInner} onClick={e => e.stopPropagation()}>
            <div className={styles.indexHeader}>
              <span className={styles.kicker}>Index</span>
              <button
                className={styles.closeBtn}
                onClick={() => setIndexOpen(false)}
                aria-label="Close index"
              >
                ×
              </button>
            </div>
            <div className={styles.indexGrid}>
              {photoEntries.map(({ photo, index }) => (
                <button
                  key={photo.id}
                  className={styles.indexItem}
                  data-active={active === index}
                  onClick={() => {
                    setIndexOpen(false)
                    go(index)
                  }}
                >
                  <Image
                    src={photo.image}
                    alt={altFor(photo)}
                    sizes="240px"
                    placeholder="blur"
                    className={styles.indexThumb}
                  />
                  <span className={styles.indexCaption}>
                    {photo.title}
                    {photo.catalog ? ` · ${photo.catalog}` : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
