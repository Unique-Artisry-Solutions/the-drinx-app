
import React from 'react';
import { BookOpen, Link as LinkIcon, FileText, Coffee } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ResourcesPage = () => {
  const articles = [
    {
      title: "The Rise of Non-Alcoholic Cocktails",
      description: "Exploring the growing trend of sophisticated non-alcoholic beverages",
      category: "Trends",
      date: "June 15, 2023"
    },
    {
      title: "10 Essential Ingredients for Your Non-Alcoholic Bar",
      description: "Stock your home bar with these versatile non-alcoholic essentials",
      category: "Guides",
      date: "August 22, 2023"
    },
    {
      title: "Interview: Pioneering Non-Alcoholic Mixologists",
      description: "Meet the creators behind some of the most innovative alcohol-free drinks",
      category: "Interviews",
      date: "October 5, 2023"
    }
  ];

  const recipes = [
    {
      title: "Citrus Fizz Mocktail",
      difficulty: "Easy",
      time: "5 min"
    },
    {
      title: "Berry Kombucha Spritz",
      difficulty: "Medium",
      time: "10 min"
    },
    {
      title: "Smoked Cinnamon Old Fashioned",
      difficulty: "Advanced",
      time: "15 min"
    }
  ];

  return (
    <Layout>
      <div className="resources-page max-w-5xl mx-auto">
        <div className="resources-header text-center mb-12">
          <BookOpen className="w-16 h-16 mx-auto text-spiritless-pink mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of articles, recipes, and guides to enhance your non-alcoholic experience
          </p>
        </div>

        <div className="resources-content space-y-16">
          <section className="resources-section">
            <div className="section-header flex items-center mb-6">
              <FileText className="h-6 w-6 text-spiritless-pink mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Latest Articles</h2>
            </div>
            
            <div className="articles-grid grid md:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <Card key={index} className="article-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-spiritless-pink/10 text-spiritless-pink">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.date}</span>
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {article.description}
                    </CardDescription>
                    <Button variant="ghost" size="sm" className="text-spiritless-pink hover:text-spiritless-pink/80">
                      Read more
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="text-spiritless-pink border-spiritless-pink hover:bg-spiritless-pink/10">
                View all articles
              </Button>
            </div>
          </section>

          <section className="resources-section">
            <div className="section-header flex items-center mb-6">
              <Coffee className="h-6 w-6 text-spiritless-pink mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Popular Recipes</h2>
            </div>
            
            <div className="recipes-grid grid md:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <div key={index} className="recipe-card bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">{recipe.title}</h3>
                  <div className="recipe-meta flex space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <span className="font-medium text-gray-700 mr-1">Difficulty:</span> {recipe.difficulty}
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium text-gray-700 mr-1">Time:</span> {recipe.time}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-spiritless-pink hover:text-spiritless-pink/80">
                    View recipe
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="text-spiritless-pink border-spiritless-pink hover:bg-spiritless-pink/10">
                Explore all recipes
              </Button>
            </div>
          </section>

          <section className="resources-section">
            <div className="section-header flex items-center mb-6">
              <LinkIcon className="h-6 w-6 text-spiritless-pink mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Useful Links</h2>
            </div>
            
            <div className="links-list space-y-4">
              <div className="link-item p-4 bg-white rounded-lg border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Non-Alcoholic Spirits Guide</h3>
                  <p className="text-gray-600">A comprehensive overview of alcohol-free alternatives</p>
                </div>
                <Button variant="ghost" size="sm" className="text-spiritless-pink">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Visit
                </Button>
              </div>
              
              <div className="link-item p-4 bg-white rounded-lg border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Mocktail Masterclass</h3>
                  <p className="text-gray-600">Online course for crafting exceptional non-alcoholic drinks</p>
                </div>
                <Button variant="ghost" size="sm" className="text-spiritless-pink">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Visit
                </Button>
              </div>
              
              <div className="link-item p-4 bg-white rounded-lg border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Community Forum</h3>
                  <p className="text-gray-600">Connect with other non-alcoholic enthusiasts</p>
                </div>
                <Button variant="ghost" size="sm" className="text-spiritless-pink">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Visit
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
