use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum TransformationAction {
    Paraphrase,
    Expand,
    Summarize,
    Translate,
}
