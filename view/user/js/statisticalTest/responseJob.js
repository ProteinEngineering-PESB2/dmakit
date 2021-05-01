$(document).ready(function() {

	var algorithms = ["Pearson Coeficient", "Spearman Coeficient", "Kendall Tau Coeficient", "Mann-Whitney Test", "Kolmogorov-Smirnov", "Shapiro Test", "ANOVA", "T test"];
	var definitions1 = "Pearson correlation coefficient is a measure of the linear correlation between two variables X and Y. According to the Cauchy–Schwarz inequality it has a value between +1 and −1, where 1 is total positive linear correlation, 0 is no linear correlation, and −1 is total negative linear correlation.";
	var definitions2 =  "Is a nonparametric measure of rank correlation (statistical dependence between the rankings of two variables). It assesses how well the relationship between two variables can be described using a monotonic function. The Spearman correlation between two variables is equal to the Pearson correlation between the rank values of those two variables; while Pearson's correlation assesses linear relationships, Spearman's correlation assesses monotonic relationships (whether linear or not). If there are no repeated data values, a perfect Spearman correlation of +1 or −1 occurs when each of the variables is a perfect monotone function of the other.";

	var definitions3 = "Is a statistic used to measure the ordinal association between two measured quantities. A tau test is a non-parametric hypothesis test for statistical dependence based on the tau coefficient. It is a measure of rank correlation: the similarity of the orderings of the data when ranked by each of the quantities. Intuitively, the Kendall correlation between two variables will be high when observations have a similar (or identical for a correlation of 1) rank (i.e. relative position label of the observations within the variable: 1st, 2nd, 3rd, etc.) between the two variables, and low when observations have a dissimilar (or fully different for a correlation of -1) rank between the two variables.";

	var definitions4 = "In statistics, the Mann–Whitney U test (also called the Mann–Whitney–Wilcoxon (MWW), Wilcoxon rank-sum test, or Wilcoxon–Mann–Whitney test) is a nonparametric test of the null hypothesis that it is equally likely that a randomly selected value from one sample will be less than or greater than a randomly selected value from a second sample. This test can be used to determine whether two independent samples were selected from populations having the same distribution; a similar nonparametric test used on dependent samples is the Wilcoxon signed-rank test.";

	var definitions5 = " Kolmogorov–Smirnov test (K–S test or KS test) is a nonparametric test of the equality of continuous, one-dimensional probability distributions that can be used to compare a sample with a reference probability distribution (one-sample K–S test), or to compare two samples (two-sample K–S test). The Kolmogorov–Smirnov statistic quantifies a distance between the empirical distribution function of the sample and the cumulative distribution function of the reference distribution, or between the empirical distribution functions of two samples.";

	var definitions6 = "The Shapiro–Wilk test is a test of normality in frequentist statistics. The null-hypothesis of this test is that the population is normally distributed. Thus, on the one hand, if the p-value is less than the chosen alpha level, then the null hypothesis is rejected and there is evidence that the data tested are not normally distributed. On the other hand, if the p-value is greater than the chosen alpha level, then the null hypothesis that the data came from a normally distributed population can not be rejected (e.g., for an alpha level of 0.05, a data set with a p-value of less than 0.05 rejects the null hypothesis that the data are from a normally distributed population).";

	var definitions7 = "Analysis of variance (ANOVA) is a collection of statistical models and their associated estimation procedures (such as the 'variation' among and between groups) used to analyze the differences among group means in a sample. ANOVA setting, the observed variance in a particular variable is partitioned into components attributable to different sources of variation. In its simplest form, ANOVA provides a statistical test of whether the population means of several groups are equal, and therefore generalizes the t-test to more than two groups.";

	var definitions8 = "A t-test is most commonly applied when the test statistic would follow a normal distribution if the value of a scaling term in the test statistic were known. When the scaling term is unknown and is replaced by an estimate based on the data, the test statistics (under certain conditions) follow a Student's t distribution. The t-test can be used, for example, to determine if two sets of data are significantly different from each other.";

	var definitions = [definitions1, definitions2, definitions3, definitions4, definitions5, definitions6, definitions7, definitions8];

	var pvalue = getValuesURL('pvalue');
	var statistic = getValuesURL('statistic');
	var option = getValuesURL('option');

	//cambiamos las definiciones...
	$(".algoritm").html(algorithms[option-1]);
	$(".statisticValue").html(statistic);

	$(".pvalue").html(pvalue);
	$(".definitions").html(definitions[option-1]);

});

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getValuesURL(key) {

	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;

}
