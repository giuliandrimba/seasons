import React, { useContext, useEffect, useRef } from 'react';
import { CanvasElement } from './styled';
import WhackAMole from './game/WhackAMole';
import { ThemeContext } from '../App/App';

export default () => {
  const canvas = useRef(null);
  const theme = useContext(ThemeContext);
  let pixi: any;

  const resize = () => {
    canvas.current.setAttribute('width', window.innerWidth * 2);
    canvas.current.setAttribute('height', window.innerHeight * 2);
    pixi.resize();
  }

  useEffect(() => {
    pixi = new WhackAMole(canvas.current, theme);
    resize();
    window.addEventListener('resize', resize)
  }, [])

  return (
    <CanvasElement
      ref={canvas}
    />
  )
}
