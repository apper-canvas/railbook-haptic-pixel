import apper from 'https://cdn.apper.io/actions/apper-actions.js';
import { jsPDF } from 'npm:jspdf';

export default apper.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const booking = await req.json();

    if (!booking || !booking.pnr) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid booking data provided' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new PDF document
    const doc = new jsPDF();
    
    // Header with railway branding
    doc.setFillColor(30, 58, 138); // Primary blue
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('RailBook - Train Ticket', 105, 16, { align: 'center' });

    // PNR and Status
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`PNR: ${booking.pnr}`, 20, 40);
    doc.text(`Status: ${booking.status}`, 150, 40);

    // Train Information
    doc.setFontSize(16);
    doc.text(`${booking.trainNumber} - ${booking.trainName}`, 20, 55);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Journey Date: ${booking.journeyDate}`, 20, 65);

    // Journey Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Journey Details', 20, 85);
    doc.line(20, 88, 190, 88);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`From: ${booking.origin}`, 20, 100);
    doc.text(`Departure: ${booking.departureTime}`, 20, 110);
    doc.text(`To: ${booking.destination}`, 110, 100);
    doc.text(`Arrival: ${booking.arrivalTime}`, 110, 110);
    doc.text(`Class: ${booking.class}`, 20, 120);

    // Passenger Information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Passenger Information', 20, 140);
    doc.line(20, 143, 190, 143);

    let yPos = 155;
    booking.passengers.forEach((passenger, index) => {
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`${index + 1}. ${passenger.name} (Age: ${passenger.age}, ${passenger.gender})`, 25, yPos);
      doc.text(`Seat: ${booking.seatNumbers[index]}`, 150, yPos);
      yPos += 12;
    });

    // Fare Information
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Fare Details', 20, yPos);
    doc.line(20, yPos + 3, 190, yPos + 3);

    yPos += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Fare: ₹${booking.fare.toLocaleString()}`, 20, yPos);

    // Important Instructions
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Important Instructions:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 10;
    doc.text('• Carry valid ID proof during journey', 25, yPos);
    yPos += 8;
    doc.text('• Arrive at station 30 minutes before departure', 25, yPos);
    yPos += 8;
    doc.text('• Keep this ticket handy throughout the journey', 25, yPos);

    // Generate PDF as base64
    const pdfBase64 = doc.output('datauristring');

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdfData: pdfBase64,
        filename: `ticket-${booking.pnr}.pdf`
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate PDF ticket. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});