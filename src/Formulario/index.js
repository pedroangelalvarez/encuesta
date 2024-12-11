import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import thankyouimage from "../assets/thakyouimage.jpg";

const Formulario = () => {
  const [searchParams] = useSearchParams();
  const numeroTelefono = searchParams.get("numeroTelefono");
  const idTicket = searchParams.get("idTicket");
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const ticketId = searchParams.get('ticketId');
    const telephone = searchParams.get('telephone');

    if (!ticketId || !telephone) {
      alert('El link es incorrecto. Debe incluir los parámetros ticketId y telephone.');
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    atencionTecnico: "",
    problemaResuelto: "",
    tiempoRespuesta: "",
    recomendarServicio: "",
    feedback: "", // Opcional
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpiar errores al cambiar los valores
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.atencionTecnico) newErrors.atencionTecnico = "Esta pregunta es obligatoria.";
    if (!formData.problemaResuelto) newErrors.problemaResuelto = "Esta pregunta es obligatoria.";
    if (!formData.tiempoRespuesta) newErrors.tiempoRespuesta = "Esta pregunta es obligatoria.";
    if (!formData.recomendarServicio) newErrors.recomendarServicio = "Esta pregunta es obligatoria.";
    return newErrors;
  };

  // Enviar los datos del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // Validar campos
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const idTicket = searchParams.get('ticketId');
    const numeroTelefono = searchParams.get('telephone');

    // Crear payload para el endpoint
    const payload = {
      telefono: numeroTelefono,
      ticketId: idTicket,
      pregunta1: formData.atencionTecnico,
      pregunta2: formData.problemaResuelto,
      pregunta3: formData.tiempoRespuesta,
      pregunta4: formData.recomendarServicio,
      pregunta5: formData.feedback || null, // Si está vacío, se envía como null
    };

    try {
      // Enviar datos al endpoint
      const response = await axios.post(
        "https://sandy-puddle-hydrangea.glitch.me/feedbacks",
        payload
      );
      console.log("Respuesta del servidor:", response.data);
      setSuccessMessage("¡Gracias por completar la encuesta!");
      setFormData({
        atencionTecnico: "",
        problemaResuelto: "",
        tiempoRespuesta: "",
        recomendarServicio: "",
        feedback: "",
      });
      setShowImage(true);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar la encuesta. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Encuesta de Satisfacción</h1>
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {showImage && (
        <img
          src={thankyouimage} 
          alt="ThankYouImage"
          style={styles.image}
        />
      )}
      {!showImage && (
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Pregunta 1 */}
        <div style={styles.question}>
          <label style={styles.label}>
            ¿Cómo calificarías la atención del técnico?<span style={styles.required}>*</span>
          </label>
          {["1 = Muy mala","2 = Mala", "3 = Aceptable","4 = Buena", "5 = Excelente"].map((value) => (
            <label key={value} style={styles.option}>
              <input
                type="radio"
                name="atencionTecnico"
                value={value}
                onChange={handleChange}
                checked={formData.atencionTecnico === `${value}`}
              />
              {` ${value}`}
            </label>
          ))}
          {errors.atencionTecnico && <p style={styles.error}>{errors.atencionTecnico}</p>}
        </div>

        {/* Pregunta 2 */}
        <div style={styles.question}>
          <label style={styles.label}>
            ¿El problema fue resuelto de manera efectiva? <span style={styles.required}>*</span>
          </label>
          {["Sí", "No", "Parcialmente"].map((value, index) => (
            <label key={value} style={styles.option}>
              <input
                type="radio"
                name="problemaResuelto"
                value={index + 1}
                onChange={handleChange}
                checked={formData.problemaResuelto === `${index + 1}`}
              />
              {` ${value}`}
            </label>
          ))}
          {errors.problemaResuelto && <p style={styles.error}>{errors.problemaResuelto}</p>}
        </div>

        {/* Pregunta 3 */}
        <div style={styles.question}>
          <label style={styles.label}>
            ¿Estás satisfecho con el tiempo de respuesta? <span style={styles.required}>*</span>
          </label>
          {["1 = Muy insatisfecho","2 = Insatisfecho", "3 = Neutro","4 = Satifecho", "5 = Muy satisfecho"].map((value) => (
            <label key={value} style={styles.option}>
              <input
                type="radio"
                name="tiempoRespuesta"
                value={value}
                onChange={handleChange}
                checked={formData.tiempoRespuesta === `${value}`}
              />
              {` ${value}`}
            </label>
          ))}
          {errors.tiempoRespuesta && <p style={styles.error}>{errors.tiempoRespuesta}</p>}
        </div>

        {/* Pregunta 4 */}
        <div style={styles.question}>
          <label style={styles.label}>
            ¿Recomendarías nuestro servicio? <span style={styles.required}>*</span>
          </label>
          {["Sí", "No"].map((value, index) => (
            <label key={value} style={styles.option}>
              <input
                type="radio"
                name="recomendarServicio"
                value={index + 1}
                onChange={handleChange}
                checked={formData.recomendarServicio === `${index + 1}`}
              />
              {` ${value}`}
            </label>
          ))}
          {errors.recomendarServicio && <p style={styles.error}>{errors.recomendarServicio}</p>}
        </div>

        {/* Pregunta 5 */}
        <div style={styles.question}>
          <label style={styles.label}>Dame un pequeño feedback, por favor (Opcional)</label>
          <textarea
            name="feedback"
            rows="4"
            style={styles.textarea}
            value={formData.feedback}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={styles.button}>
          Enviar Respuestas
        </button>
      </form>
       )}
    </div>
  );
};

// Estilos en línea
const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    title: {
      textAlign: "center",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    question: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    required: {
      color: "red",
      fontSize: "0.8rem",
    },
    option: {
      display: "block",
      marginBottom: "5px",
    },
    error: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: "5px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    image: {
      marginBottom: "20px", // Añade un espacio debajo de la imagen
      maxWidth: "100%",
      height: "auto",
    },
  };

export default Formulario;
