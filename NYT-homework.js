import { ApolloServer, gql } from "apollo-server";

// creating the schema  

const typeDefs = gql`

  type Content {
    headline: String
    byline: String
    body: String
  }

  type Author {
    id: ID!
    fullName: String
    title: String
    bio: String
  }

  type Article {
    id: ID!
    title: String
    date: String
    authors: [Author]
    content: Content
  }

  type Query {
    article(id: ID!): Article
  }
`;


// mock articles to test 
const mockArticles = [
  {
    id: "0",
    title: "Article 1",
    authors: [],
    content: {
      headline: "Article 1 Headline",
      body: "Body text for article."
    }
  },
  {
    id: "1",
    title: "Article 2",
    authors: [{ fullName: "Hilary J. McMiel" }],
    content: {
      headline: "Article 2 Headline",
      body: "Body text for article."
    }
  },
  {
    id: "2",
    title: "Article 3",
    authors: [{ fullName: "Hilary J. McMiel" }, { fullName: "Leslie P. Dann Jr." }],
    content: {
      headline: "Article 3 Headline",
      body: "Body text for article."
    }
  },
  {
    id: "3",
    title: "Article 4",
    authors: [{ fullName: "Lee Cordero" }, { fullName: "Hilary J. McMiel" }, { fullName: "Leslie P. Dann Jr." }],
    content: {
      headline: "Article 4 Headline",
      body: "Body text for article."
    }
  },

];


// making the resolvers 

const resolvers = {
  Query: {
    article: (_, args) => mockArticles.find(a => a.id === args.id)
  }, // mock articles to query
  Article: {
    content: (article) => ({
      ...article.content, // exisiting article content fields and override byline
      byline: (() => {
        const authorsNames = article.authors.map(author => author.fullName); // making a list of the article authors with only their full names
        if (authorsNames.length === 0) return "";
        if (authorsNames.length === 1) return "By " + authorsNames[0]; 

        // otherwise, when there is more than 1 author, comma seperate all the names and before the last one add "and"

        const lastAuthor = authorsNames.pop(); // finding and removing the last name in the list
        return "By " + authorsNames.join(", ") + " and " + lastAuthor;
      })
    })
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
