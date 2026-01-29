import axios from "axios";
import { useState } from "react";

export default function AIRecommend() {
  const [form, setForm] = useState({
    ingredients: "",
    diet: "",
    allergies: "",
    ageGroup: ""
  });

  const [result, setResult] = useState("");

  const submit = async () => {
    const res = await axios.post("https://localhost:7060/api/ai/recommend", form);
    setResult(res.data.suggestions);
  };

  return (
    <div>
      <h2>AI Recipe Recommendation</h2>
      <input placeholder="Ingredients" onChange={e => setForm({...form, ingredients:e.target.value})} />
      <input placeholder="Diet" onChange={e => setForm({...form, diet:e.target.value})} />
      <input placeholder="Allergies" onChange={e => setForm({...form, allergies:e.target.value})} />
      <input placeholder="Age Group" onChange={e => setForm({...form, ageGroup:e.target.value})} />
      <button onClick={submit}>Recommend</button>
      <pre>{result}</pre>
    </div>
  );
}
