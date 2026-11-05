import { SeedInterviewQuestion } from './types';

export const AIML_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'aiml-01',
    categoryId: 'aiml-core',
    title: 'Explain the Bias-Variance Tradeoff in Machine Learning.',
    difficulty: 'BEGINNER',
    answer:
      'The Bias-Variance tradeoff represents the fundamental tension between model underfitting and overfitting: 1. Bias (Underfitting): Error introduced by approximating a complex real-world problem with an overly simplistic model (e.g. linear regression on non-linear data). High bias models fail to capture patterns and have high training and testing error. 2. Variance (Overfitting): Error introduced by a model being excessively sensitive to small fluctuations and random noise in the training set (e.g. high-degree polynomial, deep unpruned decision trees). High variance models achieve near-zero training error but generalize poorly to unseen testing data. The goal of machine learning is to find the sweet spot that minimizes Total Error = Bias^2 + Variance + Irreducible Error.',
    keyPoints: [
      'High Bias = Underfitting; High Variance = Overfitting.',
      'Regularization (L1/L2), cross-validation, and ensemble methods (bagging/boosting) balance the tradeoff.',
    ],
    followUps: [
      {
        question: 'How do Ensemble methods address the Bias-Variance tradeoff?',
        answer: 'Bagging (Random Forest) reduces variance by averaging diverse overfitted trees; Boosting (XGBoost) reduces bias by sequentially correcting residual errors of weak learners.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Machine Learning', 'Bias Variance', 'Overfitting'],
  },
  {
    id: 'aiml-02',
    categoryId: 'aiml-core',
    title: 'What is the difference between Precision, Recall, F1-Score, and ROC-AUC?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Evaluation metrics for classification: 1. Precision = TP / (TP + FP): Of all predicted positives, how many were truly positive? Critical when False Positives are costly (e.g. spam filtering - don’t mark important work emails as spam). 2. Recall (Sensitivity) = TP / (TP + FN): Of all actual positives, how many did the model identify? Critical when False Negatives are catastrophic (e.g. cancer diagnosis, fraud detection - don’t miss a real tumor). 3. F1-Score: Harmonic mean of Precision and Recall (2 * P * R / (P + R)); best metric for imbalanced datasets. 4. ROC-AUC: Area under the True Positive Rate vs False Positive Rate curve across all classification thresholds (measures model ranking discrimination ability).',
    keyPoints: [
      'Accuracy is misleading on imbalanced datasets (e.g. 99% accuracy on a dataset with 99% negative class).',
      'Harmonic mean in F1 heavily penalizes extreme imbalances between Precision and Recall.',
    ],
    followUps: [
      {
        question: 'Why do we use the Harmonic Mean rather than the Arithmetic Mean for F1-score?',
        answer: 'The arithmetic mean gives equal weight; if precision is 1.0 and recall is 0.0, arithmetic mean is 0.5, while harmonic mean drops to 0.0, correctly reflecting failure.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte', 'Infosys'],
    tags: ['Evaluation Metrics', 'Precision', 'Recall', 'F1 Score'],
  },
  {
    id: 'aiml-03',
    categoryId: 'aiml-core',
    title: 'Explain L1 (Lasso) vs L2 (Ridge) Regularization.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Regularization prevents overfitting by adding a penalty term to the loss function that discourages complex models with excessively large weights: 1. L1 Regularization (Lasso): Adds the sum of absolute values of weights (λ * Σ|w_i|). It produces Sparse Models by driving less important feature weights exactly to ZERO, performing automatic feature selection. 2. L2 Regularization (Ridge): Adds the sum of squared weights (λ * Σ(w_i)^2). It shrinks weights asymptotically toward zero, preventing any single feature from dominating, but rarely sets weights exactly to zero. Elastic Net combines both L1 and L2 penalties.',
    keyPoints: [
      'L1 = diamond-shaped constraint boundary (hits coordinate axes at 0, creating sparsity).',
      'L2 = circular/spherical constraint boundary (smooth shrinkage).',
    ],
    followUps: [
      {
        question: 'When should you choose Lasso over Ridge?',
        answer: 'When you have high-dimensional data with many redundant or irrelevant features and want automatic feature selection.',
      },
    ],
    companies: ['InfoCepts', 'Deloitte', 'Infosys'],
    tags: ['Regularization', 'L1', 'L2', 'Lasso', 'Ridge'],
  },
  {
    id: 'aiml-04',
    categoryId: 'aiml-deep',
    title: 'How does Backpropagation and Gradient Descent train a Neural Network?',
    difficulty: 'ADVANCED',
    answer:
      'Training a neural network consists of Forward Propagation, Loss Computation, and Backpropagation: 1. Forward Pass: Input data passes through layers of weighted linear combinations followed by non-linear activation functions to produce output predictions. 2. Loss Computation: A loss function (e.g. Mean Squared Error, Cross-Entropy) quantifies the prediction error. 3. Backpropagation: Uses the mathematical Chain Rule of Calculus to compute the partial derivative (gradient) of the loss with respect to every weight and bias in the network, working backward from output layer to input layer. 4. Gradient Descent: Weights are updated in the opposite direction of the gradient: W = W - η * (∂L/∂W), where η is the learning rate.',
    keyPoints: [
      'Vanishing Gradient Problem: In deep networks with Sigmoid/Tanh activations, gradients shrink exponentially toward 0 in early layers, preventing learning. Solved using ReLU activations and Residual Connections (ResNets).',
      'Optimizers like Adam combine Momentum and RMSProp adaptive learning rates.',
    ],
    followUps: [
      {
        question: 'Why is ReLU (Rectified Linear Unit) preferred over Sigmoid in hidden layers?',
        answer: 'ReLU has a constant derivative of 1 for positive inputs, eliminating the vanishing gradient problem and computing much faster (max(0, x)).',
      },
    ],
    companies: ['InfoCepts', 'Deloitte', 'Infosys'],
    tags: ['Deep Learning', 'Backpropagation', 'Neural Networks'],
  },
  {
    id: 'aiml-05',
    categoryId: 'aiml-deep',
    title: 'What is the Transformer Architecture and the Self-Attention Mechanism?',
    difficulty: 'ADVANCED',
    answer:
      'Introduced in the paper "Attention Is All You Need" (Vaswani et al., 2017), the Transformer replaced sequential RNNs/LSTMs with parallelizable Self-Attention. Self-Attention computes dynamic relationships between all words in a sentence simultaneously: every input token embedding is projected into three vectors: Query (Q), Key (K), and Value (V). Attention score is computed as: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V. This allows the model to understand context and long-range dependencies regardless of distance between words. Multi-Head Attention runs multiple attention heads in parallel, allowing the model to attend to information from different representation subspaces.',
    keyPoints: [
      'Enables massive parallel training on GPUs (unlike sequential RNNs).',
      'Foundation of all modern LLMs (GPT-4, Gemini, Claude, LLaMA).',
      'Positional encodings inject token sequence order information into the permutation-invariant attention matrix.',
    ],
    followUps: [
      {
        question: 'Why is the dot product Q * K^T divided by sqrt(d_k)?',
        answer: 'To prevent large values from pushing the softmax function into regions with tiny gradients (softmax saturation).',
      },
    ],
    companies: ['InfoCepts', 'Deloitte', 'Infosys'],
    tags: ['Transformers', 'Attention', 'LLM', 'Deep Learning'],
  },
];
