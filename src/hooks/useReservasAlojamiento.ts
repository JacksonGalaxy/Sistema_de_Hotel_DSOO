import { useState, ChangeEvent, FormEvent } from 'react';

// ─── Enums ────────────────────────────────────────────────────────
export type TipoAlojamiento =
  | 'HABITACION_ESTANDAR'
  | 'HABITACION_DELUXE'
  | 'SUITE'
  | 'VILLA_PREMIUM';

export type EstadoAlojamiento =
  | 'DISPONIBLE'
  | 'OCUPADA'
  | 'SUCIA'
  | 'EN_LIMPIEZA'
  | 'MANTENIMIENTO'
  | 'INACTIVA';

export type EstadoReserva =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'COMPLETADA';

export type TipoCliente = 'ESTANDAR' | 'PREMIUM' | 'VIP';
export type TipoPago = 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA';
export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'REEMBOLSADO';

// ─── Interfaces del diagrama de clases ───────────────────────────
export interface Alojamiento {
  id_alojamiento: number;
  numero_unidad: string;
  tipo: TipoAlojamiento;
  precio_base_noche: number;
  estado: EstadoAlojamiento;
  amenidades_incluidas: string;
  estancia_minima_noches: number;
  activo: boolean;
}

export interface ReglaUpgrade {
  id_regla: number;
  noches_desde: number;
  noches_hasta: number;
  porcentaje_premium: number;
  porcentaje_vip: number;
}

export interface Cliente {
  id_cliente: number;
  numero_cliente: string;
  nombre_completo: string;
  tipo_cliente: TipoCliente;
}

export interface ModificacionReserva {
  id_modificacion: number;
  fecha_modificacion: string;
  campo_modificado: string;
  valor_anterior: string;
  valor_nuevo: string;
  motivo_cambio: string;
}

export interface Pago {
  id_pago: number;
  monto: number;
  tipo_pago: TipoPago;
  estado: EstadoPago;
  referencia: string;
  fecha_hora: string;
  descripcion: string;
}

export interface ReservaAlojamiento {
  id_reserva: number;
  codigo_confirmacion: string;
  id_cliente: number;
  id_alojamiento: number;
  fecha_check_in: string;
  fecha_check_out: string;
  num_noches: number;
  precio_base_noche: number;
  porcentaje_upgrade: number;
  costo_total: number;
  estado: EstadoReserva;
  fecha_creacion: string;
  fecha_cancelacion: string;
  monto_penalizacion: number;
  modificaciones: ModificacionReserva[];
  pago: Pago | null;
}

// ─── Datos semilla ────────────────────────────────────────────────
const reglasUpgrade: ReglaUpgrade[] = [
  { id_regla: 1, noches_desde: 1, noches_hasta: 1, porcentaje_premium: 110, porcentaje_vip: 140 },
  { id_regla: 2, noches_desde: 2, noches_hasta: 2, porcentaje_premium: 95,  porcentaje_vip: 120 },
  { id_regla: 3, noches_desde: 3, noches_hasta: 3, porcentaje_premium: 80,  porcentaje_vip: 105 },
  { id_regla: 4, noches_desde: 4, noches_hasta: 4, porcentaje_premium: 70,  porcentaje_vip: 90  },
  { id_regla: 5, noches_desde: 5, noches_hasta: 6, porcentaje_premium: 60,  porcentaje_vip: 75  },
  { id_regla: 6, noches_desde: 7, noches_hasta: 999, porcentaje_premium: 50, porcentaje_vip: 60 },
];

const alojamientosIniciales: Alojamiento[] = [
  { id_alojamiento: 1, numero_unidad: '101', tipo: 'HABITACION_ESTANDAR', precio_base_noche: 800,  estado: 'DISPONIBLE', amenidades_incluidas: 'WiFi, TV, Aire acondicionado',        estancia_minima_noches: 1, activo: true },
  { id_alojamiento: 2, numero_unidad: '102', tipo: 'HABITACION_ESTANDAR', precio_base_noche: 800,  estado: 'OCUPADA',    amenidades_incluidas: 'WiFi, TV, Aire acondicionado',        estancia_minima_noches: 1, activo: true },
  { id_alojamiento: 3, numero_unidad: '201', tipo: 'HABITACION_DELUXE',   precio_base_noche: 1200, estado: 'DISPONIBLE', amenidades_incluidas: 'WiFi, TV, Jacuzzi, Vista al mar',    estancia_minima_noches: 1, activo: true },
  { id_alojamiento: 4, numero_unidad: '301', tipo: 'SUITE',               precio_base_noche: 2500, estado: 'DISPONIBLE', amenidades_incluidas: 'WiFi, TV, Jacuzzi, Sala, Terraza',   estancia_minima_noches: 1, activo: true },
  { id_alojamiento: 5, numero_unidad: 'V-1', tipo: 'VILLA_PREMIUM',       precio_base_noche: 5000, estado: 'DISPONIBLE', amenidades_incluidas: 'WiFi, Piscina privada, Chef, Spa',   estancia_minima_noches: 2, activo: true },
  { id_alojamiento: 6, numero_unidad: 'V-2', tipo: 'VILLA_PREMIUM',       precio_base_noche: 6000, estado: 'MANTENIMIENTO', amenidades_incluidas: 'WiFi, Piscina, Chef, Spa, Gym',  estancia_minima_noches: 2, activo: true },
];

const clientesIniciales: Cliente[] = [
  { id_cliente: 1, numero_cliente: 'CLI-001', nombre_completo: 'Laura Sánchez',  tipo_cliente: 'ESTANDAR' },
  { id_cliente: 2, numero_cliente: 'CLI-002', nombre_completo: 'Miguel Torres',   tipo_cliente: 'PREMIUM' },
  { id_cliente: 3, numero_cliente: 'CLI-003', nombre_completo: 'Sofía Herrera',   tipo_cliente: 'VIP' },
];

const reservasIniciales: ReservaAlojamiento[] = [
  {
    id_reserva: 1,
    codigo_confirmacion: 'RES-2025-001',
    id_cliente: 2,
    id_alojamiento: 3,
    fecha_check_in: '2025-03-25',
    fecha_check_out: '2025-03-28',
    num_noches: 3,
    precio_base_noche: 1200,
    porcentaje_upgrade: 80,
    costo_total: 2880,
    estado: 'CONFIRMADA',
    fecha_creacion: '2025-03-18 10:00',
    fecha_cancelacion: '',
    monto_penalizacion: 0,
    modificaciones: [],
    pago: { id_pago: 1, monto: 2880, tipo_pago: 'TARJETA_CREDITO', estado: 'APROBADO', referencia: 'PAY-001', fecha_hora: '2025-03-18 10:05', descripcion: 'Pago reserva RES-2025-001' },
  },
];

// ─── Formulario crear reserva ─────────────────────────────────────
export interface CrearReservaForm {
  id_cliente: number | '';
  id_alojamiento: number | '';
  fecha_check_in: string;
  fecha_check_out: string;
  tipo_pago: TipoPago | '';
}

// ─── Helpers ──────────────────────────────────────────────────────

/** UC-07: obtener porcentaje de upgrade según noches y tipo de cliente */
const obtenerPorcentaje = (numNoches: number, tipo: TipoCliente): number => {
  if (tipo === 'ESTANDAR') return 100;
  const regla = reglasUpgrade.find(r => numNoches >= r.noches_desde && numNoches <= r.noches_hasta);
  if (!regla) return 100;
  return tipo === 'PREMIUM' ? regla.porcentaje_premium : regla.porcentaje_vip;
};

/** UC-08: calcular penalización según tipo de cliente y horas antes del check-in */
const calcularPenalizacion = (costoTotal: number, tipo: TipoCliente, checkIn: string): number => {
  const ahora      = new Date();
  const fechaCI    = new Date(checkIn);
  const horasRestantes = (fechaCI.getTime() - ahora.getTime()) / 3600000;

  if (tipo === 'VIP') return 0;
  if (tipo === 'PREMIUM' && horasRestantes < 24) return costoTotal * 0.30;
  if (tipo === 'ESTANDAR' && horasRestantes < 48) return costoTotal * 0.50;
  return 0;
};

const generarCodigo = (id: number) =>
  `RES-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;

const calcularNoches = (checkIn: string, checkOut: string): number => {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(diff / 86400000);
};

// ─── Hook principal ───────────────────────────────────────────────
export const useReservasAlojamiento = () => {
  const [reservas,    setReservas]    = useState<ReservaAlojamiento[]>(reservasIniciales);
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>(alojamientosIniciales);
  const [clientes]                    = useState<Cliente[]>(clientesIniciales);

  const [vistaActiva, setVistaActiva] = useState<'lista' | 'crear' | 'detalle'>('lista');
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaAlojamiento | null>(null);
  const [mensaje, setMensaje]         = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Vista previa de costo antes de confirmar
  const [preview, setPreview] = useState<{
    numNoches: number;
    porcentaje: number;
    costoTotal: number;
    esVilla: boolean;
    tipoCliente: TipoCliente | null;
    alojamiento: Alojamiento | null;
  } | null>(null);

  const [formCrear, setFormCrear] = useState<CrearReservaForm>({
    id_cliente: '',
    id_alojamiento: '',
    fecha_check_in: '',
    fecha_check_out: '',
    tipo_pago: '',
  });

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 4000);
  };

  // ── Recalcular preview cada vez que cambia el formulario ────────
  const handleChangeCrear = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nuevo = {
      ...formCrear,
      [name]: (name === 'id_cliente' || name === 'id_alojamiento')
        ? (value === '' ? '' : Number(value))
        : value,
    } as CrearReservaForm;

    setFormCrear(nuevo);

    // Recalcular preview si hay suficientes datos
    if (nuevo.id_cliente && nuevo.id_alojamiento && nuevo.fecha_check_in && nuevo.fecha_check_out) {
      const cliente     = clientes.find(c => c.id_cliente === Number(nuevo.id_cliente));
      const alojamiento = alojamientos.find(a => a.id_alojamiento === Number(nuevo.id_alojamiento));
      if (!cliente || !alojamiento) { setPreview(null); return; }

      const numNoches   = calcularNoches(nuevo.fecha_check_in, nuevo.fecha_check_out);
      if (numNoches <= 0) { setPreview(null); return; }

      const esVilla     = alojamiento.tipo === 'VILLA_PREMIUM';
      const porcentaje  = obtenerPorcentaje(numNoches, cliente.tipo_cliente);
      const costoTotal  = alojamiento.precio_base_noche * numNoches * (porcentaje / 100);

      setPreview({ numNoches, porcentaje, costoTotal, esVilla, tipoCliente: cliente.tipo_cliente, alojamiento });
    } else {
      setPreview(null);
    }
  };

  // ── UC-04: Crear reserva ────────────────────────────────────────
  const handleSubmitCrear = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cliente     = clientes.find(c => c.id_cliente === Number(formCrear.id_cliente));
    const alojamiento = alojamientos.find(a => a.id_alojamiento === Number(formCrear.id_alojamiento));

    if (!cliente || !alojamiento) {
      mostrarMensaje('error', 'Seleccione un cliente y un alojamiento válidos.');
      return;
    }

    const numNoches = calcularNoches(formCrear.fecha_check_in, formCrear.fecha_check_out);

    // Validar fechas
    if (numNoches <= 0) {
      mostrarMensaje('error', 'La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    // UC-05: Validar acceso a villas
    if (alojamiento.tipo === 'VILLA_PREMIUM' && cliente.tipo_cliente === 'ESTANDAR') {
      mostrarMensaje('error', 'Las villas solo están disponibles para clientes Premium y VIP.');
      return;
    }

    // UC-06: Validar estancia mínima en villas
    if (alojamiento.tipo === 'VILLA_PREMIUM' && numNoches < 2) {
      mostrarMensaje('error', 'Las villas requieren una estancia mínima de 2 noches.');
      return;
    }

    // Validar disponibilidad
    if (alojamiento.estado !== 'DISPONIBLE') {
      mostrarMensaje('error', `El alojamiento no está disponible (estado actual: ${alojamiento.estado}).`);
      return;
    }

    // UC-07: Calcular upgrade
    const porcentaje = obtenerPorcentaje(numNoches, cliente.tipo_cliente);
    const costoTotal = alojamiento.precio_base_noche * numNoches * (porcentaje / 100);
    const nuevoId    = reservas.length + 2;

    const nuevaReserva: ReservaAlojamiento = {
      id_reserva: nuevoId,
      codigo_confirmacion: generarCodigo(nuevoId),
      id_cliente: cliente.id_cliente,
      id_alojamiento: alojamiento.id_alojamiento,
      fecha_check_in: formCrear.fecha_check_in,
      fecha_check_out: formCrear.fecha_check_out,
      num_noches: numNoches,
      precio_base_noche: alojamiento.precio_base_noche,
      porcentaje_upgrade: porcentaje,
      costo_total: costoTotal,
      estado: 'CONFIRMADA',
      fecha_creacion: new Date().toLocaleString('sv-SE').slice(0, 16),
      fecha_cancelacion: '',
      monto_penalizacion: 0,
      modificaciones: [],
      pago: {
        id_pago: nuevoId,
        monto: costoTotal,
        tipo_pago: formCrear.tipo_pago as TipoPago,
        estado: 'APROBADO',
        referencia: `PAY-${String(nuevoId).padStart(3, '0')}`,
        fecha_hora: new Date().toLocaleString('sv-SE').slice(0, 16),
        descripcion: `Pago reserva ${generarCodigo(nuevoId)}`,
      },
    };

    setReservas(prev => [...prev, nuevaReserva]);

    // Actualizar estado del alojamiento a OCUPADA
    setAlojamientos(prev =>
      prev.map(a =>
        a.id_alojamiento === alojamiento.id_alojamiento
          ? { ...a, estado: 'OCUPADA' as EstadoAlojamiento }
          : a
      )
    );

    mostrarMensaje('exito', `✓ Reserva ${nuevaReserva.codigo_confirmacion} creada exitosamente. Costo total: $${costoTotal.toLocaleString()}`);
    setFormCrear({ id_cliente: '', id_alojamiento: '', fecha_check_in: '', fecha_check_out: '', tipo_pago: '' });
    setPreview(null);
    setVistaActiva('lista');
  };

  // ── UC-08: Cancelar reserva ─────────────────────────────────────
  const cancelarReserva = (id_reserva: number) => {
    const reserva = reservas.find(r => r.id_reserva === id_reserva);
    if (!reserva) return;

    if (reserva.estado === 'CANCELADA') {
      mostrarMensaje('error', 'La reserva ya fue cancelada.');
      return;
    }
    if (reserva.estado === 'COMPLETADA') {
      mostrarMensaje('error', 'No se puede cancelar una reserva completada.');
      return;
    }

    const cliente      = clientes.find(c => c.id_cliente === reserva.id_cliente);
    const tipo         = cliente?.tipo_cliente ?? 'ESTANDAR';
    const penalizacion = calcularPenalizacion(reserva.costo_total, tipo, reserva.fecha_check_in);

    setReservas(prev =>
      prev.map(r =>
        r.id_reserva === id_reserva
          ? {
              ...r,
              estado: 'CANCELADA' as EstadoReserva,
              fecha_cancelacion: new Date().toLocaleString('sv-SE').slice(0, 16),
              monto_penalizacion: penalizacion,
              pago: r.pago ? { ...r.pago, estado: 'REEMBOLSADO' as EstadoPago } : null,
            }
          : r
      )
    );

    // Liberar el alojamiento
    setAlojamientos(prev =>
      prev.map(a =>
        a.id_alojamiento === reserva.id_alojamiento
          ? { ...a, estado: 'DISPONIBLE' as EstadoAlojamiento }
          : a
      )
    );

    const msgPen = penalizacion > 0
      ? ` Penalización aplicada: $${penalizacion.toLocaleString()} (${tipo === 'PREMIUM' ? '30%' : '50%'}).`
      : ' Sin penalización.';
    mostrarMensaje('exito', `✓ Reserva ${reserva.codigo_confirmacion} cancelada.${msgPen}`);
    setReservaSeleccionada(null);
  };

  // ── Helpers de UI ───────────────────────────────────────────────
  const getNombreCliente    = (id: number) => clientes.find(c => c.id_cliente === id)?.nombre_completo ?? '—';
  const getTipoCliente      = (id: number) => clientes.find(c => c.id_cliente === id)?.tipo_cliente ?? 'ESTANDAR';
  const getNumeroUnidad     = (id: number) => alojamientos.find(a => a.id_alojamiento === id)?.numero_unidad ?? '—';
  const getTipoAlojamiento  = (id: number) => alojamientos.find(a => a.id_alojamiento === id)?.tipo ?? '—';

  /** Alojamientos visibles según el tipo de cliente seleccionado (UC-05) */
  const alojamientosDisponibles = (tipoCliente: TipoCliente | null) =>
    alojamientos.filter(a => {
      if (!a.activo || a.estado !== 'DISPONIBLE') return false;
      if (a.tipo === 'VILLA_PREMIUM' && tipoCliente === 'ESTANDAR') return false;
      return true;
    });

  const clienteSeleccionado = formCrear.id_cliente
    ? clientes.find(c => c.id_cliente === Number(formCrear.id_cliente)) ?? null
    : null;

  return {
    reservas,
    alojamientos,
    clientes,
    reglasUpgrade,
    vistaActiva,
    setVistaActiva,
    reservaSeleccionada,
    setReservaSeleccionada,
    mensaje,
    formCrear,
    preview,
    handleChangeCrear,
    handleSubmitCrear,
    cancelarReserva,
    getNombreCliente,
    getTipoCliente,
    getNumeroUnidad,
    getTipoAlojamiento,
    alojamientosDisponibles,
    clienteSeleccionado,
  };
};