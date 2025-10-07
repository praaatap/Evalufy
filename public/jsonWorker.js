self.onmessage = async (event) => {
  if (event.data === "load") {
    try {
      const response = await fetch("/aws_questions.json");
      const data = await response.json();
      self.postMessage({ success: true, data });
    } catch (err) {
      self.postMessage({ success: false, error: err.message });
    }
  }
};
