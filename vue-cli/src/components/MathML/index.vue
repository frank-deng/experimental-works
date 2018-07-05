<template>
	<math xmlns="http://www.w3.org/1998/Math/MathML">
         <mrow>
			<msup><mi>a</mi><mn>2</mn></msup>
			<mo>+</mo>
			<msup><mi>b</mi><mn>2</mn></msup>
			<mo>=</mo>
			<msup><mi>c</mi><mn>2</mn></msup>
         </mrow>
	</math>
</template>
<script type="text/x-mathjax-config">
export default {
	mounted(){
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	},
}
</script>
