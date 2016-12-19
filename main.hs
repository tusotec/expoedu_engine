module Main where

import Data
import Knowledge

hello txt = "Hello " ++ txt ++ "!"

buildAll str = buildKnowledge (parseFile str) [Group "nulo" [] []]

main args = do
  cont <- readFile "data.txt"
  println $ hello "Arnaud"
  println "File contents:"
  println (show (buildAll cont))
